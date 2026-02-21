"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, clearToken } from "@/lib/api";

export default function RoleSelectionPage() {
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const router = useRouter();

  const handleAdminSelect = async () => {
    try {
      setLoadingAdmin(true);
      const myTeams = await apiFetch("/teams/me");
      const adminTeam = myTeams.find((t: any) => t.my_role === "admin");
      if (adminTeam) {
        const params = new URLSearchParams({ teamId: adminTeam.id, authCode: adminTeam.auth_code, name: adminTeam.name });
        router.push(`/admin/dashboard?${params}`);
      } else {
        router.push("/admin/create-club");
      }
    } catch {
      alert("관리자 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoadingAdmin(false);
    }
  };

  const handleParticipantSelect = () => {
    router.push("/participant/clubs");
  };

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">환영합니다! 👋</h1>
        <p className="text-base text-gray-600">역할을 선택해주세요</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Admin Card */}
        <button
          className="border-2 border-purple-500 rounded-2xl p-6 bg-white text-left shadow-sm active:opacity-80 disabled:opacity-60"
          onClick={handleAdminSelect}
          disabled={loadingAdmin}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
              {loadingAdmin ? (
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-800 mb-1">관리자</p>
              <p className="text-sm text-gray-600 mb-3">팀을 만들고 멤버를 관리합니다</p>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500">• 팀 생성 및 인증코드 발급</p>
                <p className="text-xs text-gray-500">• 멤버 승인 및 관리</p>
                <p className="text-xs text-gray-500">• 미션 등록 및 채점</p>
              </div>
            </div>
          </div>
        </button>

        {/* Participant Card */}
        <button
          className="border-2 border-pink-500 rounded-2xl p-6 bg-white text-left shadow-sm active:opacity-80 disabled:opacity-60"
          onClick={handleParticipantSelect}
          disabled={loadingAdmin}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-800 mb-1">참여자</p>
              <p className="text-sm text-gray-600 mb-3">인증코드로 팀에 가입합니다</p>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500">• 인증코드로 팀 가입</p>
                <p className="text-xs text-gray-500">• 밥약 매칭 참여</p>
                <p className="text-xs text-gray-500">• 미션 수행 및 제출</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      <button className="mt-8 flex items-center justify-center gap-2 py-3 text-red-500" onClick={handleLogout}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
        </svg>
        <span className="text-sm font-medium">로그아웃</span>
      </button>
    </div>
  );
}
