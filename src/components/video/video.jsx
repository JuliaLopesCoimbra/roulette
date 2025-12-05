"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoCenterPage({ videoSrc }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const router = useRouter();

 useEffect(() => {
  const v = videoRef.current;
  if (!v) return;

  // Necessário para autoplay
  v.muted = true;
  v.playsInline = true;

  const tryPlay = () => {
    if (!hasEnded && v.paused) {
      v.play().catch(() => {});
    }
  };
  tryPlay();

  // --- HABILITAR SOM APÓS INTERAÇÃO ---
  const enableSound = () => {
    v.muted = false;        // liga o som
    v.volume = 1.0;
    v.play().catch(() => {});
    window.removeEventListener("click", enableSound);
    window.removeEventListener("touchstart", enableSound);
  };

  window.addEventListener("click", enableSound);
  window.addEventListener("touchstart", enableSound);

  // --- QUANDO O VÍDEO ACABA ---
  const onEnded = () => {
    setHasEnded(true);
    v.pause();
    v.currentTime = v.duration || v.currentTime;
    router.push("/pages/user/roulette");
  };

  // --- PROGRESSO DO VÍDEO ---
  const onTimeUpdate = () => {
    if (v.duration) {
      setProgress((v.currentTime / v.duration) * 100);
    }
  };

  // --- QUANDO USUÁRIO VOLTA PARA A ABA ---
  const onVisibility = () => {
    if (document.visibilityState === "visible") tryPlay();
  };

  v.addEventListener("ended", onEnded);
  v.addEventListener("timeupdate", onTimeUpdate);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    v.removeEventListener("ended", onEnded);
    v.removeEventListener("timeupdate", onTimeUpdate);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("click", enableSound);
    window.removeEventListener("touchstart", enableSound);
  };
}, [router, hasEnded]);


  return (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
    >
      {/* Barra de progresso */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 z-20">
        <div
          className="h-full bg-[#ff496a] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Vídeo sem UI */}
      <video
        key={videoSrc} // garante estado limpo se trocar o arquivo
        ref={videoRef}
        src={videoSrc}
        autoPlay
       
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        tabIndex={-1}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
      />
    </div>
  );
}
