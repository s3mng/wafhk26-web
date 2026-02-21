"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/date";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const myTeams = await apiFetch("/teams/me");
      setClubs(myTeams.filter((t: any) => t.my_role !== "admin"));
    } catch {
      console.error("Failed to fetch clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Header */}
      <div className="rounded-b-3xl pb-6" style={{ backgroundColor: "#9333ea", boxShadow: "0 4px 24px rgba(147,51,234,0.2)" }}>
        <div className="flex items-center justify-between px-4 pt-4">
          <button className="p-2 -ml-2" onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <button
            className="p-2 -mr-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            onClick={() => router.push("/participant/join-club")}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
        <div className="px-6 mt-4">
          <p className="text-purple-200 text-sm font-medium mb-1">zomoim • 참여자 모드</p>
          <h1 className="text-white text-2xl font-bold">환영합니다! 👋</h1>
          <p className="text-purple-100 text-sm mt-1.5 opacity-90">내 클럽 미션과 활동을 확인해보세요</p>
        </div>
      </div>

      {/* Club List */}
      <div className="flex-1 p-5 flex flex-col gap-4 pt-6">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
              <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : clubs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 gap-6">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="#c084fc">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-800">참여 중인 팀이 없습니다</p>
            <p className="text-sm text-gray-500 text-center leading-relaxed">오른쪽 상단의 + 버튼을 눌러서{"\n"}인증코드로 새로운 팀에 가입해보세요!</p>
          </div>
        ) : clubs.map(club => (
          <button
            key={club.id}
            className="flex items-center bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-left active:opacity-80"
            onClick={() => {
              const p = new URLSearchParams({ id: club.id, name: club.name });
              router.push(`/participant/club-details?${p}`);
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mr-4 shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-gray-800 mb-1">{club.name}</p>
              <p className="text-sm text-gray-500">가입일: {formatDate(club.created_at)}</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#d1d5db"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}
