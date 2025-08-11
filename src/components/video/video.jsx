"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function VideoCenterPage({ videoSrc }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => router.push("/pages/user/roulette");

    const handleTimeUpdate = () => {
      if (video?.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);
      }
    };

    const handleVisibilityChange = () => {
      if (video) {
        if (document.visibilityState === "visible") {
          video.play().catch(() => console.warn("Autoplay bloqueado."));
        } else {
          video.pause();
        }
      }
    };

    if (video) {
      video.muted = false;
      video.play().catch(() => console.warn("Autoplay com som pode ter sido bloqueado."));

      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      video.paused ? video.play() : video.pause();
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">

      {/* 🔝 Barra de Progresso no Topo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700 z-20">
        <div
          className="h-full bg-[#973bfe] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 🎥 Vídeo em Tela Cheia */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted={false}
        loop={false}
        controls={false}
        onClick={togglePlayPause}
        className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer"
      />
    </div>
  );
}
