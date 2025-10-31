"use client";
import { motion } from "framer-motion";
import FileUpload from "../parts/FileUpload";
import React from "react";

export default function Step1Intro({ next }: { next: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45 }}
      className="max-w-xl w-full p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl"
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Criar Campanha CPV</h1>
      <p className="text-gray-300 mb-6">Dê um nome e suba o criativo (imagem ou vídeo).</p>

      <label className="block text-sm text-gray-300">Nome da campanha</label>
      <input
        className="w-full p-3 mt-1 rounded bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        placeholder="Ex: Lançamento Coleção Verão"
      />

      <div className="mt-6">
        <FileUpload />
      </div>

      <div className="mt-8 flex gap-3">
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
