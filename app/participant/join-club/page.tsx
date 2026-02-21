"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function JoinClubPage() {
  const [authCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (!authCode.trim()) { alert("인증 코드를 입력해주세요."); return; }
    try {
      setLoading(true);
      await apiFetch("/teams/join", { method: "POST", body: JSON.stringify({ auth_code: authCode }) });
      alert("클럽에 가입되었습니다!");
      router.back();
    } catch {
      alert("클럽 가입에 실패했습니다. 코드를 다시 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button className="p-2" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">팀에 가입하기</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6">
        <div className="flex flex-col items-center mt-8 mb-10">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "#ec4899", boxShadow: "0 4px 16px rgba(236,72,153,0.3)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M17 7H13V9H17C18.65 9 20 10.35 20 12C20 13.65 18.65 15 17 15H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7ZM11 15H7C5.35 15 4 13.65 4 12C4 10.35 5.35 9 7 9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15ZM8 13H16V11H8V13Z"/>
            </svg>
          </div>
          <p className="text-sm text-gray-600 text-center">관리자에게 받은 인증코드를 입력하세요</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">인증코드</label>
          <input
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-2xl font-bold tracking-widest text-center text-gray-800 placeholder-gray-400 outline-none focus:border-pink-400"
            placeholder="예: ABC123"
            value={authCode}
            onChange={e => setAuthCode(e.target.value.toUpperCase())}
            autoCorrect="off"
            onKeyDown={e => e.key === "Enter" && handleJoin()}
          />
          <button
            className="py-4 rounded-xl text-white text-base font-semibold mt-4 disabled:opacity-60"
            style={{ backgroundColor: "#ec4899", boxShadow: "0 4px 12px rgba(236,72,153,0.2)" }}
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? "처리 중..." : "확인"}
          </button>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-yellow-900 mb-2">💡 안내</p>
            <p className="text-xs text-yellow-900 mb-1">• 인증코드는 대소문자를 구분합니다</p>
            <p className="text-xs text-yellow-900">• 관리자 승인 없이 가입이 완료됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
