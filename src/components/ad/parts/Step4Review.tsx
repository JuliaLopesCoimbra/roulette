"use client";
import { motion } from "framer-motion";
import React from "react";

export default function Step4Review({ back }: { back: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45 }}
      className="max-w-2xl w-full p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Revisar & Confirmar</h2>
      <p className="text-gray-300 mb-6">
        Confira os detalhes antes de finalizar a compra do anúncio.
      </p>

      {/* Placeholder: quando elevarmos estado, renderizamos os dados reais aqui */}
      <div className="space-y-3 text-sm text-gray-200">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Nome da campanha</span><span className="text-yellow-400">—</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Orçamento</span><span className="text-yellow-400">—</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Período</span><span className="text-yellow-400">—</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Segmentação</span><span className="text-yellow-400">—</span>
        </div>
        <div className="flex justify-between pb-2">
          <span>Área/Mapa</span><span className="text-yellow-400">—</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={back}
          className="w-40 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-semibold"
        >
          ← Voltar
        </button>
        <button
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-3 rounded-lg font-semibold"
          type="button"
          onClick={() => alert("Compra confirmada! (wire real depois)")}
        >
          Confirmar compra
        </button>
      </div>
    </motion.div>
  );
}
