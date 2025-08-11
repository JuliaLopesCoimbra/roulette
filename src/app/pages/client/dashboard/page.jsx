"use client";
import React, { useState } from "react";
import Ads from "@/components/client/Ads/Ads";
import Analytics from "@/components/client/Analytics/Analytics";
import Principal from "@/components/client/Principal/Principal";
import Profile from "@/components/client/Profile/Profile";
import Chart from "@/components/client/Chart/Chart";

export default function Dashboard() {
    const [selected, setSelected] = useState("inicio");

    const renderComponent = () => {
        switch (selected) {
            case "inicio":
                return <Principal />;
            case "anuncios":
                return <Ads />;
            case "dashboard":
                return <Chart />;
            case "analytics":
                return <Analytics />;
            case "perfil":
                return <Profile />;
            default:
                return <Principal />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "#1f1f1f" }}>
            {/* Sidebar */}
            <div className="w-64 bg-[#2c2c2e] text-white flex flex-col p-6 space-y-4 flex-shrink-0">
                <h2 className="text-xl font-bold mb-4">Painel</h2>
                <button
                    onClick={() => setSelected("inicio")}
                    className={`text-left px-2 py-2 rounded hover:bg-[#3f3f46] ${
                        selected === "inicio" ? "bg-[#facc15] text-black" : ""
                    }`}
                >
                    Início
                </button>
                <button
                    onClick={() => setSelected("anuncios")}
                    className={`text-left px-2 py-2 rounded hover:bg-[#3f3f46] ${
                        selected === "anuncios" ? "bg-[#facc15] text-black" : ""
                    }`}
                >
                    Anúncios
                </button>
                <button
                    onClick={() => setSelected("dashboard")}
                    className={`text-left px-2 py-2 rounded hover:bg-[#3f3f46] ${
                        selected === "dashboard" ? "bg-[#facc15] text-black" : ""
                    }`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setSelected("analytics")}
                    className={`text-left px-2 py-2 rounded hover:bg-[#3f3f46] ${
                        selected === "analytics" ? "bg-[#facc15] text-black" : ""
                    }`}
                >
                    Análises
                </button>
                <button
                    onClick={() => setSelected("perfil")}
                    className={`text-left px-2 py-2 rounded hover:bg-[#3f3f46] ${
                        selected === "perfil" ? "bg-[#facc15] text-black" : ""
                    }`}
                >
                    Perfil
                </button>
            </div>

            {/* Main Content - Scrollável */}
            <div className="flex-1 overflow-y-auto p-8 text-white">
                <h1 className="text-3xl font-bold mb-6 capitalize">{selected}</h1>
                {renderComponent()}
            </div>
        </div>
    );
}
