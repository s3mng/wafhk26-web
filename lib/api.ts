// Use Next.js API proxy to avoid CORS issues
const BASE_URL = "/api/proxy";

export interface GroupItem {
  id: number;
  team_id: number;
  name: string;
  leader_id: number;
  created_at: string;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  user_name: string;
  user_student_id: string;
  user_hakbun: number;
  role: string;
}

let accessToken: string | null = null;

export const setToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt_token", token);
  }
};

export const getToken = (): string | null => {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("jwt_token");
    if (stored) {
      accessToken = stored;
      return stored;
    }
  }
  return null;
};

export const clearToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
  }
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: `알 수 없는 오류가 발생했습니다. (Status: ${response.status})` };
    }
    throw new Error(JSON.stringify(errorData));
  }

  if (response.status === 204) return null;
  return response.json();
};
