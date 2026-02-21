"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

function ClubDetailsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") || "";
  const name = params.get("name") || "클럽 미션";

  const [teamMissions, setTeamMissions] = useState<any[]>([]);
  const [groupMissions, setGroupMissions] = useState<any[]>([]);
  const [rankInfo, setRankInfo] = useState<{ rank: number; points: number; groupName: string } | null>(null);
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupMembers, setGroupMembers] = useState<{id:number;username:string;hakbun:number}[]>([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");

      const myGroups = await apiFetch("/groups/me");
      const myGroup = myGroups.find((g: any) => g.team_id === Number(id));

      if (!myGroup) { setError("해당 팀에 아직 소속된 조(그룹)가 없습니다."); setLoading(false); return; }

      const gId = myGroup.id;
      setGroupId(gId);

      const [teamMissionsData, leaderboardData, membersData] = await Promise.all([
        apiFetch(`/teams/${id}/missions`),
        apiFetch(`/leaderboard/${id}`),
        apiFetch(`/groups/${gId}/members`),
      ]);
      if (Array.isArray(membersData)) setGroupMembers(membersData);
      setTeamMissions(teamMissionsData);

      let groupMissionsData: any[] = [];
      try {
        groupMissionsData = await apiFetch(`/groups/${gId}/missions`);
        if (!Array.isArray(groupMissionsData)) groupMissionsData = [];
      } catch {}
      setGroupMissions(groupMissionsData);

      if (Array.isArray(leaderboardData)) {
        const sorted = [...leaderboardData].sort((a, b) => b.points - a.points);
        setLeaderboardList(sorted);
        const idx = sorted.findIndex((e: any) => e.group_id === gId);
        setRankInfo({ rank: idx !== -1 ? idx + 1 : sorted.length + 1, points: idx !== -1 ? sorted[idx].points : 0, groupName: myGroup.name });
      }
    } catch (e: any) {
      setError(`정보를 불러오는데 실패했습니다.\n\n${e?.message || ""}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button className="p-2 -ml-2" onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <p className="text-base font-semibold text-gray-600">{name}</p>
          <div className="w-10" />
        </div>
        <div className="px-5 pb-4">
          <h1 className="text-xl font-bold text-gray-800">미션</h1>
          <p className="text-sm text-gray-500 mt-1">조 미션을 수행하고 점수를 획득하세요</p>
        </div>
      </div>

      {error ? (
        <div className="m-4 p-4 bg-red-100 rounded-xl text-red-700 font-semibold text-sm whitespace-pre-wrap">{error}</div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {/* My Group Members */}
            {!loading && groupMembers.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 active:opacity-80"
                  onClick={() => setShowMembers(!showMembers)}
                >
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#a855f7">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span className="text-base font-bold text-gray-800">내 조원 [{groupMembers.length}]</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af" className={`transition-transform ${showMembers ? "rotate-180" : ""}`}>
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                  </svg>
                </button>
                {showMembers && (
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    {groupMembers.map(m => (
                      <div key={m.id} className="flex items-center gap-3 py-1.5 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6b7280">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{m.username}</span>
                        <span className="text-xs text-gray-500">{m.hakbun}학번</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
                  <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
            ) : teamMissions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#d1d5db"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                <p className="text-lg font-semibold text-gray-600">아직 등록된 미션이 없습니다.</p>
                <p className="text-sm text-gray-400 text-center">운영자가 미션을 추가하면 이곳에 표시됩니다.</p>
              </div>
            ) : teamMissions.map(item => {
              const gm = groupMissions.find(g => (g.mission_id ?? g.id) === item.id);
              const isSuccess = gm?.status === "success";
              return (
                <button
                  key={item.id}
                  className={`rounded-xl p-4 text-left ${isSuccess ? "bg-green-50 border border-green-200" : "bg-white border-2 border-purple-200"}`}
                  onClick={() => {
                    if (!isSuccess && groupId !== null) {
                      router.push(`/participant/mission-submit?missionId=${item.id}&groupId=${groupId}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-base font-semibold text-gray-800 flex-1">{item.title}</p>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium shrink-0 ${isSuccess ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {isSuccess ? "완료" : "진행중"}
                    </span>
                  </div>
                  <div className="mb-3"><span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">팀 미션</span></div>
                  <p className="text-sm text-gray-600 mb-3 leading-5 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                      <p className="text-xs text-gray-500">등록일: {formatDate(item.created_at)}</p>
                    </div>
                    {isSuccess && <p className="text-xs text-green-600 font-medium">✓ 승인완료</p>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Score Bar */}
          {rankInfo && (
            <button
              className="p-4 bg-white border-t border-gray-200 w-full text-left"
              onClick={() => setShowLeaderboard(true)}
            >
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-900 mb-1">내 조 ({rankInfo.groupName}) 점수</p>
                    <p className="text-2xl font-bold text-purple-600">{rankInfo.points}점</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-900 mb-1">현재 순위</p>
                    <p className="text-2xl font-bold text-purple-600">{rankInfo.rank}등</p>
                  </div>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">전체 조 순위</h2>
              <button className="p-1" onClick={() => setShowLeaderboard(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#4b5563"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 pb-10">
              {leaderboardList.length === 0 ? (
                <p className="text-center text-gray-500 py-8">순위 데이터가 없습니다.</p>
              ) : leaderboardList.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center py-3 px-4 border-b border-gray-100 ${item.group_id === groupId ? "bg-purple-50 rounded-lg border-none" : ""}`}
                >
                  <div className="w-12">
                    <span className={`text-base font-semibold ${idx < 3 ? "text-amber-600 font-bold" : "text-gray-600"}`}>{idx + 1}등</span>
                  </div>
                  <p className={`flex-1 text-base ${item.group_id === groupId ? "font-bold text-purple-700" : "text-gray-700"}`}>{item.group_name}</p>
                  <p className="text-base font-semibold text-gray-600">{item.points}점</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClubDetailsPage() {
  return <Suspense><ClubDetailsContent /></Suspense>;
}
