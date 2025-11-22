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

    // força autoplay
    v.muted = true;
    v.playsInline = true;

    const tryPlay = () => {
      if (!hasEnded && v.paused) {
        v.play().catch(() => {});
      }
    };
    tryPlay();

    const onEnded = () => {
      setHasEnded(true);
      // evita qualquer re-play acidental
      v.pause();
      // garante que o tempo pare no final (alguns browsers "loopam" para 0 por um frame)
      v.currentTime = v.duration || v.currentTime;
      router.push("/pages/user/roulette");
    };

    const onTimeUpdate = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };

    // Se o usuário voltar para a aba, tenta tocar apenas se não terminou
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
        muted
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
