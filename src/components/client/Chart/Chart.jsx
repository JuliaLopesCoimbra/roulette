"use client";
import { React, useState } from "react";
import ViewsChart from "./charts/ViewsChart";
import ClicksChart from "./charts/ClicksChart";
import TypeAd from "./charts/TypeAdChart";
import PerfomanceChart from "./charts/PerfomanceChart";
import AllClicksViewsYear from "./charts/AllClicksViewsYear";
import ByStates from "./charts/ByStates";
import ByHobbies from "./charts/ByHobbies";
import ByJobs from "./charts/ByJobs";
import ByAge from "./charts/ByAge";
import Funil from "./charts/Funil";
import ByMarcas from "./charts/ByMarcas";
import BySocialMedias from "./charts/BySocialMedias";

export default function Chart() {
    const [modo, setModo] = useState("basico");

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => setModo("basico")}
                    className={`px-4 py-2 rounded ${modo === "basico"
                            ? "bg-yellow-500 text-black font-semibold"
                            : "bg-[#1f1f1f] text-white border border-gray-600"
                        }`}
                >
                    Básico
                </button>
                <button
                    onClick={() => setModo("avancado")}
                    className={`px-4 py-2 rounded ${modo === "avancado"
                            ? "bg-yellow-500 text-black font-semibold"
                            : "bg-[#1f1f1f] text-white border border-gray-600"
                        }`}
                >
                    Avançado
                </button>
            </div>

            {/* Gráficos em comum (modo básico) */}
            {modo === "basico" && (
                <>
                    <ViewsChart />
                    <ClicksChart />
                    {/* <TypeAd /> */}
                    <ByJobs />
                    <PerfomanceChart />
                    <AllClicksViewsYear />
                    <ByStates />
                    <ByMarcas />
                    <ByHobbies />
                    <ByAge />
                    <BySocialMedias />
                </>
            )}

            {/* Gráfico avançado */}
            {modo === "avancado" && <Funil />}
        </div>
    );
}
