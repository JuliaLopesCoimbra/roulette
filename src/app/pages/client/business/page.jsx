"use client";
import BuyAdCPC from "@/components/client/Ads/BuyAdCPC";
import BuyAdCPV from "@/components/client/Ads/BuyAdCPV";
import React, { useState } from "react";

export default function Business() {
    const [selectedType, setSelectedType] = useState(null);
    const [hideIntro, setHideIntro] = useState(false);

    const handleSelect = (type) => {
        setHideIntro(true);
        setTimeout(() => {
            setSelectedType(type);
        }, 600); // esperar a animação terminar antes de mostrar o formulário
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
            {/* Tela inicial */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-700 ${hideIntro ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                    }`}
            >
                <div className="text-center p-4">
                    <h1 className="text-4xl font-bold mb-4">Anuncie seu produto com inteligência</h1>
                    <p className="text-lg mb-6">Escolha qual tipo de anúncio combina mais com sua empresa</p>

                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={() => handleSelect("cpv")}
                            className="px-6 py-3 bg-blue-900 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                            Anúncio por Visualizações (CPV)
                        </button>
                        <button
                            onClick={() => handleSelect("cpc")}
                            className="px-6 py-3 bg-[#facc15] hover:bg-yellow-300 text-white font-semibold rounded-lg transition"
                        >
                            Anúncio por Cliques (CPC)
                        </button>
                    </div>
                </div>
            </div>

            {/* Formulário */}
            {selectedType && (
                <div
                    
                >
                    {selectedType === "cpv" ? (
                        <>
                            <BuyAdCPV />
                        </>
                    ) : (
                        <>
                            <BuyAdCPC />
                        </>
                    )}

                </div>
            )}
        </div>
    );
}
