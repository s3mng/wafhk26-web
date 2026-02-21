"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "@/lib/api";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!id || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      const data = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ login_id: id, password }),
      });
      if (data.access_token) {
        setToken(data.access_token);
        router.replace("/role-selection");
      }
    } catch (error: unknown) {
      let msg = "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.";
      try {
        const e = JSON.parse((error as Error).message);
        if (typeof e.detail === "string") msg = e.detail;
        else if (Array.isArray(e.detail) && e.detail[0]?.msg) msg = e.detail[0].msg;
      } catch {}
      alert(`로그인 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#b548c6", boxShadow: "0 4px 16px rgba(168,85,247,0.3)" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">bobyak</h1>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-3">
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoCapitalize="none"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          className="w-full py-4 rounded-xl text-white text-base font-semibold mt-2 disabled:opacity-60"
          style={{ backgroundColor: "#a855f7", boxShadow: "0 4px 12px rgba(168,85,247,0.2)" }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              처리 중...
            </span>
          ) : "로그인"}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">아직 계정이 없으신가요?</p>
        <button
          className="text-sm font-semibold text-purple-600"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
