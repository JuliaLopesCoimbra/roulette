"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";



export default function SuccessAnimationAurora({
  show = true,
  message = "Cadastro realizado com sucesso!",
  subtext,
  autoCloseMs = 1800,
  onClose,
}) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!show || !autoCloseMs) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [show, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP: mesh/aurora + vignette + noise */}
          <div className="absolute inset-0 overflow-hidden">
            {/* base preta para casar com seu layout */}
            <div className="absolute inset-0 bg-black" />
            {/* aurora/mesh com roxos e ciano leve */}
            <motion.div
              className="absolute inset-0"
             style={{
  background: `
    radial-gradient(1200px 600px at 10% 10%, rgba(251, 70, 103, 0.25), transparent 60%),
    radial-gradient(900px 500px at 90% 30%, rgba(251, 70, 103, 0.18), transparent 60%),
    radial-gradient(800px 500px at 50% 85%, rgba(251, 70, 103, 0.15), transparent 60%),
    #000000
  `
}}
              animate={
                prefersReduced
                  ? undefined
                  : {
                      backgroundPosition: ["0% 0%", "10% 5%", "0% 0%"],
                    }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
            {/* noise sutil */}
            <div
              className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml;utf8,\
                  <svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22 viewBox=%220 0 72 72%22>\
                  <filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter>\
                  <rect width=%2272%22 height=%2272%22 filter=%22url(%23n)%22 opacity=%220.6%22/></svg>')",
              }}
            />
          </div>

          {/* CONTEÚDO */}
          <motion.div
            className="relative flex flex-col items-center text-center px-6"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {/* anéis pulsantes */}
            <div className="relative">
              {/* ring 1 */}
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: "0 0 0 0 rgba(151,59,254,0.55)" }}
                animate={
                  prefersReduced
                    ? undefined
                    : { boxShadow: ["0 0 0 0 rgba(151,59,254,0.55)", "0 0 0 20px rgba(151,59,254,0)"] }
                }
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              />
              {/* ring 2 (desfasado) */}
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: "0 0 0 0 rgba(34,211,238,0.50)" }}
                animate={
                  prefersReduced
                    ? undefined
                    : { boxShadow: ["0 0 0 0 rgba(34,211,238,0.50)", "0 0 0 26px rgba(34,211,238,0)"] }
                }
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
              />

              {/* círculo central (glow) */}
              <motion.div
                className="relative bg-[#fb4667] w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(151,59,254,0.6)]"
                initial={{ scale: 0 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* check */}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="w-12 h-12"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>

                {/* brilho interno */}
                <div className="absolute inset-0 rounded-full bg-white/10 blur-xl pointer-events-none" />
              </motion.div>

              {/* sparkles sutis */}
              {!prefersReduced &&
                [0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/70"
                    style={{
                      top: ["-8px", "50%", "105%", "40%", "-10%"][i],
                      left: ["50%", "108%", "54%", "-6%", "10%"][i],
                      filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7))",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                  />
                ))}
            </div>

            {/* textos */}
            <motion.p
              className="mt-5 text-white text-xl md:text-2xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            >
              {message}
            </motion.p>

            {subtext && (
              <motion.p
                className="mt-2 text-white/70 text-sm md:text-base"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
              >
                {subtext}
              </motion.p>
            )}

            {/* botão fechar opcional, caso queira manter manual */}
            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                className="mt-6 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/10 transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Fechar
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
