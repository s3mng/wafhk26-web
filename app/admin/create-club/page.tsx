"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateClubPage() {
  const [clubName, setClubName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!clubName.trim()) { alert("클럽 이름을 입력해주세요."); return; }
    try {
      setLoading(true);
      const data = await apiFetch("/teams/", { method: "POST", body: JSON.stringify({ name: clubName }) });
      alert("클럽이 생성되었습니다.");
      const params = new URLSearchParams({ teamId: data.id, authCode: data.auth_code, name: data.name });
      router.replace(`/admin/dashboard?${params}`);
    } catch {
      alert("클럽 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button className="p-2" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">클럽 만들기</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6">
        <div className="mt-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">새로운 클럽을 시작해보세요!</h2>
          <p className="text-sm text-gray-600 leading-relaxed">클럽을 만들고 인증 코드를 공유하여 멤버들을 초대할 수 있습니다.</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">클럽 이름</label>
          <input
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400"
            placeholder="예) 와플"
            value={clubName}
            onChange={e => setClubName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
          />
          <button
            className="py-4 rounded-xl text-white text-base font-semibold mt-3 disabled:opacity-60"
            style={{ backgroundColor: "#a855f7", boxShadow: "0 4px 12px rgba(168,85,247,0.2)" }}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "처리 중..." : "클럽 만들기"}
          </button>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-900 mb-2">💡 안내</p>
            <p className="text-xs text-blue-900 leading-5">클럽을 만들면 가입용 인증코드가 자동으로 생성됩니다.</p>
            <p className="text-xs text-blue-900 leading-5">조원들에게 코드를 공유하여 우리 조로 초대해보세요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
