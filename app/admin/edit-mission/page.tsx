"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

function EditMissionContent() {
  const params = useSearchParams();
  const router = useRouter();
  const teamId = params.get("teamId") || "";
  const missionId = params.get("missionId") || "";
  const isEdit = !!missionId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiFetch(`/missions/${missionId}`)
      .then(d => { setTitle(d.title || ""); setDescription(d.description || ""); })
      .catch(() => { alert("미션 정보를 불러오지 못했습니다."); router.back(); })
      .finally(() => setLoading(false));
  }, [missionId]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) { alert("미션 제목과 설명을 모두 입력해주세요."); return; }
    try {
      setSubmitting(true);
      if (isEdit) {
        await apiFetch(`/missions/${missionId}`, { method: "PATCH", body: JSON.stringify({ title: title.trim(), description: description.trim() }) });
        alert("미션이 수정되었습니다."); router.back();
      } else {
        await apiFetch("/missions/", { method: "POST", body: JSON.stringify({ team_id: Number(teamId), title: title.trim(), description: description.trim() }) });
        alert("미션이 추가되었습니다."); router.back();
      }
    } catch {
      alert(`미션을 ${isEdit ? "수정" : "추가"}하는 중 문제가 발생했습니다.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("이 미션을 삭제하시겠습니까?")) return;
    try {
      setSubmitting(true);
      await apiFetch(`/missions/${missionId}`, { method: "DELETE" });
      router.back();
    } catch {
      alert("미션 삭제에 실패했습니다.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#a855f7" strokeWidth="4"/>
          <path className="opacity-75" fill="#a855f7" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button className="p-2 -ml-2" onClick={() => router.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1f2937"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{isEdit ? "미션 수정" : "미션 추가"}</h1>
        {isEdit ? (
          <button className="p-2 -mr-2" onClick={handleDelete} disabled={submitting}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        ) : <div className="w-10" />}
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-600">미션 제목</label>
          <input
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400"
            placeholder="미션 제목을 입력하세요 (예: 모두 함께 점심 먹기)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold text-gray-600">미션 설명</label>
          <textarea
            className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 resize-none"
            placeholder="미션의 상세 내용과 수행 방법을 적어주세요."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={6}
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          className="w-full py-4 rounded-xl text-white text-base font-bold disabled:opacity-50"
          style={{ backgroundColor: !title.trim() || !description.trim() ? "#d8b4fe" : "#a855f7" }}
          onClick={handleSave}
          disabled={!title.trim() || !description.trim() || submitting}
        >
          {submitting ? "처리 중..." : isEdit ? "수정 완료" : "미션 추가"}
        </button>
      </div>
    </div>
  );
}

export default function EditMissionPage() {
  return <Suspense><EditMissionContent /></Suspense>;
}
