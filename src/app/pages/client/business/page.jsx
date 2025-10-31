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
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%), #0b0b0d",
      }}
    >
      {/* ✅ BOTÃO VOLTAR */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => router.back()}                // <-- AQUI ESTÁ A FUNÇÃO DE VOLTAR
          className="text-[#973bfe] hover:text-purple-900 transition"
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
              className="px-6 py-3 bg-purple-900 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
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
