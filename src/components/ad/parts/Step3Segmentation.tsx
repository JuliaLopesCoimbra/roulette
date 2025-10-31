"use client";
import { motion } from "framer-motion";
import Segmentation from "../parts/Segmentation";
import MapaComRaio from "../../gps/GoogleMaps";
import React from "react";

export default function Step3Segmentation({
  next,
  back,
}: {
  next: () => void;
  back: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45 }}
      className="max-w-5xl w-full p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Segmentação</h2>
      <p className="text-gray-300 mb-6">Escolha interesses, perfil e localização.</p>

      <Segmentation />

      <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow mt-6">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Localização do público-alvo
        </label>
        <MapaComRaio />
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={back}
          className="w-40 bg-white/10 hover:bg白/20 py-3 rounded-lg font-semibold"
        >
          ← Voltar
        </button>
        <button
          onClick={next}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg font-semibold"
        >
          Continuar →
        </button>
      </div>
    </motion.div>
  );
}
