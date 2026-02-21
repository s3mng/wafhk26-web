"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

function TeamMissionsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const teamId = params.get("teamId") || "";
  const teamName = params.get("name") || "팀 미션";
  const authCode = params.get("authCode") || "";

  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMissions = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch(`/teams/${teamId}/missions`);
      setMissions(data);
    } catch {
      setError("미션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { fetchMissions(); }, [fetchMissions]);

  const goCreate = () => {
    router.push(`/admin/edit-mission?teamId=${teamId}`);
  };

  const goMission = (item: any) => {
    const p = new URLSearchParams({ teamId, missionId: item.id.toString(), title: item.title, description: item.description, createdAt: item.created_at });
    router.push(`/admin/mission-status?${p}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button className="p-2 -ml-2" onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <p className="text-sm font-semibold text-gray-600">{teamName}</p>
          <div className="w-10" />
        </div>
        <div className="px-5 pb-4">
          <h1 className="text-xl font-bold text-gray-800">미션 관리</h1>
          <p className="text-sm text-gray-500 mt-1">모든 조가 수행할 팀 전체 미션을 생성하세요</p>
        </div>
      </div>

      {error ? (
        <div className="m-4 p-4 bg-red-100 rounded-xl text-center text-red-700 font-semibold">{error}</div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-16">
                <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
                  <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
            ) : missions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#d1d5db">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <p className="text-lg font-semibold text-gray-600">등록된 미션이 없습니다.</p>
                <p className="text-sm text-gray-400 text-center">미션을 추가하고 팀원들에게 공유해보세요!</p>
              </div>
            ) : missions.map(item => (
              <button key={item.id} className="bg-white rounded-xl p-4 border border-gray-200 text-left active:opacity-80" onClick={() => goMission(item)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-base font-semibold text-gray-800 flex-1 truncate">{item.title}</p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">팀 미션</span>
                  {item.points ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      ⭐ {item.points}점
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5">{item.description}</p>
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                  <p className="text-xs text-gray-500">작성일: {formatDate(item.created_at)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <button
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold"
              style={{ backgroundColor: "#a855f7" }}
              onClick={goCreate}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              미션 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamMissionsPage() {
  return <Suspense><TeamMissionsContent /></Suspense>;
}
