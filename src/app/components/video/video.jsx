"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../header/HeaderWithOutButtons";

export default function VideoCenterPage({ videoSrc }) {
  const videoRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => setShowButton(true);

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

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen px-4 bg-[#1f1f1f]">
      <Header />
      <div className="flex-grow flex items-center justify-center w-full">
        <motion.div {...fadeIn(0)} className="w-full max-w-3xl text-center">
          <h1 className="text-[2.7vh] mb-2 text-white">
            Termine de assistir o vídeo para continuar
          </h1>

          <div className="relative">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted={false}
              loop={false}
              controls={false}
              onClick={togglePlayPause}
              className="w-full h-auto rounded-xl shadow-xl cursor-pointer"
            />

            {/* 🔵 Barra de Progresso */}
            <div className="w-full h-1 bg-gray-700 rounded  overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
             {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-2 bg-[#facc15] text-black rounded hover:bg-[#e0b80f] transition  font-semibold mt-10"
          onClick={() => router.push("/pages/roulette")}
        >
          Continuar
        </motion.button>
      )}
          </div>
        </motion.div>
      </div>

     
    </div>
  );
}
