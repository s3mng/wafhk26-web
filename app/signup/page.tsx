"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [mbti, setMbti] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!id || !password || !username || !studentId || !mbti) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    try {
      setLoading(true);
      await apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({ login_id: id, password, username, student_id: studentId, mbti, gender }),
      });
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      router.replace("/login");
    } catch (error: unknown) {
      let msg = "회원가입에 실패했습니다. 입력값을 다시 확인해주세요.";
      try {
        const e = JSON.parse((error as Error).message);
        if (typeof e.detail === "string") msg = e.detail;
        else if (Array.isArray(e.detail) && e.detail[0]?.msg) msg = e.detail[0].msg;
      } catch {}
      alert(`회원가입 실패: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 overflow-y-auto">
      {/* Back */}
      <button className="absolute top-4 left-4 p-2" onClick={() => router.back()}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      {/* Header */}
      <div className="flex flex-col items-center mb-8 mt-8">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#b548c6", boxShadow: "0 4px 16px rgba(168,85,247,0.3)" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">bobyak</h1>
        <p className="text-sm text-gray-600">새로운 계정을 만들어보세요</p>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-3">
        <input className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400" placeholder="아이디" value={id} onChange={e => setId(e.target.value)} autoCapitalize="none" />
        <input className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400" placeholder="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400" placeholder="이름" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400" placeholder="학번" value={studentId} onChange={e => setStudentId(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400" placeholder="MBTI (예: ENFP)" value={mbti} onChange={e => setMbti(e.target.value.toUpperCase())} maxLength={4} />

        {/* Gender Toggle */}
        <div className="mt-1 mb-2">
          <p className="text-sm text-gray-600 mb-2 ml-1">성별</p>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${gender === g ? "bg-white text-gray-800 font-semibold shadow-sm" : "text-gray-500"}`}
                onClick={() => setGender(g)}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-4 rounded-xl text-white text-base font-semibold mt-2 disabled:opacity-60"
          style={{ backgroundColor: "#a855f7", boxShadow: "0 4px 12px rgba(168,85,247,0.2)" }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "처리 중..." : "가입하기"}
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm text-gray-600">이미 계정이 있으신가요?</p>
        <button className="text-sm font-semibold text-purple-600" onClick={() => router.replace("/login")}>로그인</button>
      </div>
    </div>
  );
}
