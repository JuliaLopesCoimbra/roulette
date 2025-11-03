"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoCenterPage({ videoSrc }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // força autoplay
    v.muted = true;
    v.playsInline = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();

    const onEnded = () => router.push("/pages/user/roulette");
    const onTimeUpdate = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };
    const onPause = () => setTimeout(() => v.play().catch(() => {}), 0);
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* 🔝 Barra de Progresso */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 z-20">
        <div
          className="h-full bg-[#fb4667] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 🎥 Vídeo fixo, sem qualquer UI */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        tabIndex={-1}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />
    </div>
  );
}
