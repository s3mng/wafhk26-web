"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

function MissionSubmitContent() {
  const params = useSearchParams();
  const router = useRouter();
  const missionId = params.get("missionId") || "";
  const groupId = params.get("groupId") || "";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("environment");
  const [hasCamera, setHasCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async (mode: "environment" | "user" = cameraMode) => {
    try {
      if (stream) { stream.getTracks().forEach(t => t.stop()); }
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      setStream(s);
      setHasCamera(true);
      if (videoRef.current) { videoRef.current.srcObject = s; }
    } catch {
      setHasCamera(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    c.toBlob(blob => {
      if (!blob) return;
      setPreviewBlob(blob);
      setPreview(URL.createObjectURL(blob));
    }, "image/jpeg", 0.7);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewBlob(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!previewBlob) return;
    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append("file", previewBlob, `mission_${missionId}_${Date.now()}.jpg`);
      await apiFetch(`/missions/${missionId}/submit?group_id=${groupId}`, { method: "POST", body: formData });
      alert("미션이 성공적으로 제출되었습니다.");
      router.back();
    } catch (e: any) {
      alert(`미션 제출 중 문제가 발생했습니다.\n\n${e?.message || ""}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4 px-5">
        <button className="absolute left-5 w-11 h-11 flex items-center justify-center" onClick={() => router.back()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        <p className="text-white text-lg font-bold">미션 제출</p>
      </div>

      {/* Preview or Camera */}
      {preview ? (
        <div className="flex-1 flex flex-col pt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="flex-1 object-contain" />
          <div className="p-6 flex flex-col gap-3">
            {processing ? (
              <div className="flex items-center justify-center gap-3 py-4">
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-white font-semibold">사진을 제출하는 중입니다...</p>
              </div>
            ) : (
              <>
                <button className="w-full py-4 rounded-xl bg-purple-500 text-white font-bold text-base" onClick={handleSubmit}>제출하기</button>
                <button className="w-full py-3 rounded-xl bg-white/20 text-white font-medium" onClick={() => { setPreview(null); setPreviewBlob(null); }}>다시 찍기</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col pt-16 relative">
          {hasCamera ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="flex-1 object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-0 left-0 right-0 pb-10 flex flex-col items-center gap-4">
                <button
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                  onClick={handleCapture}
                >
                  <div className="w-15 h-15 rounded-full bg-white" style={{ width: 60, height: 60 }} />
                </button>
                <div className="flex items-center gap-4">
                  <button
                    className="px-4 py-2 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    onClick={() => {
                      const next = cameraMode === "environment" ? "user" : "environment";
                      setCameraMode(next);
                      startCamera(next);
                    }}
                  >
                    🔄 카메라 전환
                  </button>
                  <button
                    className="px-4 py-2 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 파일 선택
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
              <p className="text-white text-center text-base leading-relaxed">카메라를 사용할 수 없습니다.<br/>파일을 직접 선택해주세요.</p>
              <button
                className="px-8 py-4 rounded-xl font-semibold text-white"
                style={{ backgroundColor: "#7e22ce" }}
                onClick={() => fileInputRef.current?.click()}
              >
                사진 파일 선택
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
        </div>
      )}
    </div>
  );
}

export default function MissionSubmitPage() {
  return <Suspense><MissionSubmitContent /></Suspense>;
}
