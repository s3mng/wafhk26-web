"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { apiFetch, GroupItem, TeamMember } from "@/lib/api";

function DashboardContent() {
  const params = useSearchParams();
  const router = useRouter();
  const teamId = params.get("teamId") || "";
  const authCode = params.get("authCode") || "----";
  const teamName = params.get("name") || "알 수 없는 클럽";

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const [myGroups, teamMembers]: [GroupItem[], TeamMember[]] = await Promise.all([
        apiFetch("/groups/me"),
        apiFetch(`/teams/${teamId}/members`),
      ]);
      setGroups(myGroups.filter(g => g.team_id === Number(teamId)));
      setMembers(teamMembers);
    } catch {
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateGroup = async () => {
    try {
      setCreatingGroup(true);
      await apiFetch("/groups/", { method: "POST", body: JSON.stringify({ team_id: Number(teamId) }) });
      alert("새로운 조가 생성되었습니다.");
      fetchData();
    } catch {
      alert("조 생성에 실패했습니다.");
    } finally {
      setCreatingGroup(false);
    }
  };

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

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
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
              <p className="text-sm text-gray-500">팀 미션을 추가하고 배점을 설정하세요</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>

        {/* Groups Management */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7"><path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/></svg>
              <h2 className="text-xl font-bold text-gray-800">조 관리 [{groups.length}]</h2>
            </div>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: "#8b5cf6" }}
              onClick={handleCreateGroup}
              disabled={creatingGroup}
            >
              {creatingGroup ? (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  조 생성
                </>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
                <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          ) : groups.length === 0 ? (
            <div className="p-5 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-400">아직 생성된 조가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {groups.map((group, index) => (
                <div key={group.id} className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl p-4 flex items-center justify-center gap-2">
                  <span className="text-base font-bold text-fuchsia-800">{group.name || `${index + 1}조`}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b5cf6">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#a855f7">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <h2 className="text-xl font-bold text-gray-800">회원 목록 [{members.length}]</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-5">
              <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
                <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          ) : members.length === 0 ? (
            <div className="p-5 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-400">참여중인 회원이 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6b7280">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-semibold text-gray-800">{member.user_name}</span>
                      {member.role === "admin" && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">관리자</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.user_hakbun}학번</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
