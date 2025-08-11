"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaBars } from "react-icons/fa";
import prizes from "../../../../components/prizes/prizes";
dayjs.extend(customParseFormat);

export default function Dashboard() {
    const router = useRouter();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [menuOpen, setMenuOpen] = useState(false);
    const [user] = useState({
        nome: "Julia Lopes",
        email: "julia@email.com",
        brindes: [
            // Hoje
            { data: "07/08/2025 09:00", premio: "AirPods Pro" },
            { data: "07/08/2025 12:00", premio: "IFood 10%" },
            { data: "07/08/2025 15:00", premio: "Pix R$100,00" },

            // Ontem
            { data: "08/08/2025 09:00", premio: "IFood 10%" },
            { data: "08/08/2025 12:00", premio: "Pix R$100,00" },
            { data: "08/08/2025 15:00", premio: "100% Adidas" },

            // 2 dias atrás
            { data: "09/08/2025 09:00", premio: "20% Nike" },
            { data: "09/08/2025 12:00", premio: "Pix R$100,00" },
            { data: "09/08/2025 15:00", premio: "50% Shoppe" },

            // 3 dias atrás
            { data: "10/08/2025 09:00", premio: "Pix R$100,00" },
            { data: "10/08/2025 12:00", premio: "AirPods Pro" },
            { data: "10/08/2025 15:00", premio: "10% PSN" },

            // 4 dias atrás
            { data: "11/08/2025 09:00", premio: "AirPods Pro" },
            { data: "11/08/2025 12:00", premio: "100% Adidas" },
            { data: "11/08/2025 15:00", premio: "Pix R$100,00" }
        ]

    });
    const brindesDoDia = user.brindes.filter((item) => {
        if (!dataSelecionada) return false;

        const dataBrinde = dayjs(item.data, "DD/MM/YYYY").format("YYYY-MM-DD");
        const dataSelecionadaFormatada = dayjs(dataSelecionada).format("YYYY-MM-DD");

        return dataBrinde === dataSelecionadaFormatada;
    });
    const navigate = (path) => {
        setMenuOpen(false);
        router.push(path);
    };
    return (
        <div className="min-h-screen p-4 text-gray-100" style={{
            background: "radial-gradient(circle at center, #cfcfcf 0%, #3a5f8a 100%)"
        }}
        >
            <header className="relative flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="text-white text-2xl p-2 rounded hover:bg-gray-700 transition"
                    >
                        <FaBars />
                    </button>

                    <div>
                        <h1 className="text-xl font-semibold text-white">Julia Lopes</h1>
                        <p className="text-sm text-gray-300">julia@email.com</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 border border-amber-500 text-white px-6 py-2 rounded-lg shadow">
                    <img src="/img/creditos.png" alt="Créditos" className="w-8 h-8 object-contain" />
                    <p className="font-bold text-2xl">3</p>
                </div>
            </header>

            <section className=" mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <p className="text-[5vh] text-white font-semibold pl-5">Histórico de Prêmios</p>

                    {/* Linha com label + datepicker lado a lado */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-100 pl-5">Selecione uma data:</span>
                        <DatePicker
                            selected={dataSelecionada}
                            onChange={(date) => setDataSelecionada(date)}
                            className="text-sm border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            dateFormat="dd/MM/yyyy"
                            style={{
                                background: "radial-gradient(circle at center, #cfcfcf 0%, #3a5f8a 100%)"
                            }}
                        />
                    </div>
                </div>

                <ul className="space-y-3">
                    {brindesDoDia.length > 0 ? (
                        brindesDoDia.map((item, index) => {
                            const prizeMatch = prizes.find((p) => p.name === item.premio);
                            const image = prizeMatch?.image || "/img/prizes/default.png"; // fallback opcional

                            return (
                                <li
                                    key={index}
                                    
                                    className="bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-4 text-[3vh] text-white"
                                >
                                    <img
                                        src={image}
                                        alt={item.premio}
                                        className="w-10 h-10 object-contain rounded"
                                    />
                                    <div className="flex flex-col flex-1">
                                        <span className="text-sm text-gray-400">{item.data}</span>
                                        <span className="font-semibold text-gray-100">{item.premio}</span>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-center text-gray-400">Nenhum brinde neste dia.</li>
                    )}
                </ul>
            </section>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                         style={{ background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 150%)" }}
                        className="fixed inset-0 bg-opacity-90 z-50 flex flex-col justify-center items-center text-center p-8"
                    >
                        <div className="fixed inset-0 z-50 bg-opacity-90 text-left" >
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-4 right-4 text-white text-3xl"
                            >
                                ×
                            </button>
                            <nav className="flex flex-col gap-4 px-6 pt-12 text-white">
                                <button
                                    onClick={() => navigate("/pages/user/dashboard")}
                                    className="text-lg hover:text-yellow-400 transition text-left"
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => navigate("/pages/user/historico")}
                                    className="text-lg hover:text-yellow-400 transition text-left"
                                >
                                    Histórico de Prêmios
                                </button>
                                {/* <button
                                    onClick={() => navigate("/pages/user/dashboard")}
                                    className="text-lg hover:text-yellow-400 transition text-left"
                                >
                                    ideias
                                </button> */}
                                <button
                                    onClick={() => navigate("/")}
                                    className="text-lg text-red-400 hover:text-red-300 transition text-left"
                                >
                                    Sair
                                </button>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
}
