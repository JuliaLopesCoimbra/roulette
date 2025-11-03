"use client";
import BuyAdCPC from "../../../../components/client/Ads/BuyAdCPC";
import BuyAdCPV from "../../../../components/client/Ads/BuyAdCPV";
import React, { useState } from "react";
import { useRouter } from "next/navigation";   // <-- IMPORTANTE

export default function Business() {
  const router = useRouter();                  // <-- INSTANCIA O ROUTER

  const [selectedType, setSelectedType] = useState(null);
  const [hideIntro, setHideIntro] = useState(false);

  const handleSelect = (type) => {
    setHideIntro(true);
    setTimeout(() => {
      setSelectedType(type);
    }, 600);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
     style={{
  background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
}}
    >
      {/* ✅ BOTÃO VOLTAR */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.back()}                // <-- AQUI ESTÁ A FUNÇÃO DE VOLTAR
          className="text-[#fb4667] hover:text-[#f8254b] transition"
          aria-label="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Tela inicial */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-700 ${
          hideIntro ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold mb-4">Anuncie seu produto com inteligência</h1>
          <p className="text-lg mb-6">Escolha qual tipo de anúncio combina mais com sua empresa</p>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => handleSelect("cpv")}
                className="px-6 py-3 bg-[#fb4667] hover:bg-[#ef163e] text-white font-semibold rounded-lg transition"
            >
              Anúncio por Visualizações (CPV)
            </button>
            <button
              onClick={() => handleSelect("cpc")}
              className="px-6 py-3 bg-[#f8950c] hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
            >
              Anúncio por Cliques (CPC)
            </button>
          </div>
        </div>
      </div>

      {/* Formulário */}
      {selectedType && (
        <div>
          {selectedType === "cpv" ? <BuyAdCPV /> : <BuyAdCPC />}
        </div>
      )}
    </div>
  );
}
