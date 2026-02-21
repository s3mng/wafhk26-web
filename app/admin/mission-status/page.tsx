"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

function MissionStatusContent() {
  const params = useSearchParams();
  const router = useRouter();
  const teamId = params.get("teamId") || "";
  const missionId = params.get("missionId") || "";
  const title = params.get("title") || "";
  const description = params.get("description") || "";
  const createdAt = params.get("createdAt") || "";

  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatuses = useCallback(async () => {
    if (!missionId || !teamId) return;
    try {
      setLoading(true);
      setError("");
      const [groupsData, leaderboard] = await Promise.all([
        apiFetch(`/missions/${missionId}/groups`),
        apiFetch(`/leaderboard/${teamId}`),
      ]);
      const joined = groupsData.map((mg: any) => {
        const lb = leaderboard.find((l: any) => l.group_id === mg.group_id);
        return { ...mg, group_name: lb ? lb.group_name : `조 #${mg.group_id}` };
      });
      joined.sort((a: any, b: any) => a.group_id - b.group_id);
      setStatuses(joined);
    } catch {
      setError("조별 수행 현황을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [missionId, teamId]);

  useEffect(() => { fetchStatuses(); }, [fetchStatuses]);

  const successCount = statuses.filter(s => s.status === "success").length;
  const totalCount = statuses.length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-2 -ml-2" onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">미션 현황 조회</h1>
          <button className="p-2 -mr-2 text-purple-500 font-semibold text-base" onClick={() => router.push(`/admin/edit-mission?teamId=${teamId}&missionId=${missionId}`)}>수정</button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
            <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      ) : error ? (
        <div className="m-4 p-4 bg-red-100 rounded-xl text-center text-red-700 font-semibold">{error}</div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Mission Overview */}
          <div className="bg-white p-5 border-b border-gray-200 mb-2">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{description}</p>
            <p className="text-xs text-gray-400 mb-5">등록일: {formatDate(createdAt)}</p>

            {/* Stats */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 flex flex-col items-center">
                <p className="text-2xl font-bold text-gray-700">{totalCount}</p>
                <p className="text-xs text-gray-500 mt-1">전체 조</p>
              </div>
              <div className="w-px bg-gray-200 self-stretch mx-2" />
              <div className="flex-1 flex flex-col items-center">
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-xs text-gray-500 mt-1">완료 조</p>
              </div>
              <div className="w-px bg-gray-200 self-stretch mx-2" />
              <div className="flex-1 flex flex-col items-center">
                <p className="text-2xl font-bold text-yellow-600">{totalCount - successCount}</p>
                <p className="text-xs text-gray-500 mt-1">미완료/진행중</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 bg-gray-50">
            <p className="text-sm font-semibold text-gray-500">조별 수행 현황</p>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-6">
            {statuses.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">팀에 아직 조가 없거나 배정된 현황이 없습니다.</div>
            ) : statuses.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#6b7280">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-800">{item.group_name}</p>
                </div>
                <span className={`px-2.5 py-1.5 rounded-lg text-sm font-semibold ${item.status === "success" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {item.status === "success" ? "승인완료" : "대기중 / 진행중"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MissionStatusPage() {
  return <Suspense><MissionStatusContent /></Suspense>;
}
