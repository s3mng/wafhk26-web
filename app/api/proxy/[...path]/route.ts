import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://ctsyftybpwjrscsq.tunnel.elice.io/api";

async function handler(req: NextRequest) {
  // Extract the path after /api/proxy/
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/proxy", "");
  const search = url.search;
  const targetUrl = `${BASE_URL}${path}${search}`;

  // Forward headers (except host)
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key !== "host" && key !== "connection") {
      headers[key] = value;
    }
  });

  // Get body for non-GET requests
  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      body = await req.arrayBuffer();
    } else {
      body = await req.text();
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        responseHeaders.set(key, value);
      }
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { detail: "프록시 연결에 실패했습니다." },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
