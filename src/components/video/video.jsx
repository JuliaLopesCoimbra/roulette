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

  v.muted = true; // autoplay permitido
  v.playsInline = true;

  const tryPlay = () => {
    if (!hasEnded && v.paused) {
      v.play().catch(() => {});
    }
  };

  tryPlay();

  const enableSound = () => {
    v.muted = false;      // ativa áudio
    v.volume = 1.0;
    v.play().catch(() => {});
    window.removeEventListener("click", enableSound);
    window.removeEventListener("touchstart", enableSound);
  };

  // Ativa áudio assim que o usuário interagir
  window.addEventListener("click", enableSound);
  window.addEventListener("touchstart", enableSound);

  /* ... resto do seu código ... */

  return () => {
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
