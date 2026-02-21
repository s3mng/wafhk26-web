"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function DashboardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const teamId = params.get("teamId") || "";
  const authCode = params.get("authCode") || "----";
  const teamName = params.get("name") || "알 수 없는 클럽";

  const goToMissions = () => {
    const p = new URLSearchParams({ teamId, name: teamName, authCode });
    router.push(`/admin/team-missions?${p}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <button className="p-2" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">관리자 대시보드</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Club Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">내 클럽 정보</h2>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">클럽 이름</p>
            <p className="text-lg font-semibold text-gray-800">{teamName}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">가입 코드</p>
            <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-5 flex items-center justify-center">
              <p className="text-4xl font-black text-violet-500 tracking-widest">{authCode}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center leading-5 px-2">
            회원들에게 이 가입 코드를 전달하여 클럽에 가입하도록 안내해주세요.
          </p>
        </div>

        {/* Mission Management */}
        <button className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm active:opacity-80" onClick={goToMissions}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-gray-800 mb-1">미션 관리</p>
              <p className="text-sm text-gray-500">팀 미션을 추가하고 관리하세요</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>

        {/* Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-3 bg-gray-50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#9ca3af">
              <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
            </svg>
            <p className="text-gray-500 font-medium text-sm">더 많은 관리 기능은 곧 추가됩니다!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
