import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE_URL = "https://ctsyftybpwjrscsq.tunnel.elice.io/api";

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/proxy", "");
  const search = url.search;
  const targetUrl = `${BASE_URL}${path}${search}`;

  // Forward headers
  const headers: Record<string, string> = {};
  const skipReqHeaders = new Set(["host", "connection", "accept-encoding"]);
  req.headers.forEach((value, key) => {
    if (!skipReqHeaders.has(key)) {
      headers[key] = value;
    }
  });

  // Get body for non-GET requests
  let body: Uint8Array | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = await req.arrayBuffer();
    body = new Uint8Array(buf);
  }

  // Set content-length for the upstream request
  if (body) {
    headers["content-length"] = body.byteLength.toString();
  }

  try {
    // Use redirect: "manual" to handle redirects ourselves and preserve auth headers
    let response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body as BodyInit | null,
      redirect: "manual",
    });

    // Follow redirects manually to preserve Authorization header
    if (response.status === 307 || response.status === 308 || response.status === 301 || response.status === 302) {
      const location = response.headers.get("location");
      if (location) {
        const redirectUrl = new URL(location, targetUrl).toString();
        response = await fetch(redirectUrl, {
          method: req.method,
          headers,
          body: body as BodyInit | null,
          redirect: "manual",
        });
      }
    }

    const responseHeaders = new Headers();
    const skipHeaders = new Set(["transfer-encoding", "content-encoding", "content-length"]);
    response.headers.forEach((value, key) => {
      if (!skipHeaders.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204, headers: responseHeaders });
    }

    const data = await response.arrayBuffer();
    return new NextResponse(data, { status: response.status, headers: responseHeaders });
  } catch {
    return NextResponse.json({ detail: "프록시 연결에 실패했습니다." }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
