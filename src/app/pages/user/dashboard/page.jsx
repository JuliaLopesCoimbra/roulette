"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FaBars } from "react-icons/fa";
import { getBrindesDeHoje } from "../../../../utils/brindesStorage";
dayjs.extend(customParseFormat);
// Ativa os plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Define fuso horário de Brasília como padrão
const TIMEZONE = "America/Sao_Paulo";
export default function Dashboard() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const hoje = dayjs().format("YYYY-MM-DD");
    // mudar a parte de localstorage dos premios ganhados hj
    const [user] = useState({
        nome: "Julia Lopes",
        email: "julia@email.com",
    });
    const navigate = (path) => {
        setMenuOpen(false);
        router.push(path);
    };
    const [brindesHoje, setBrindesHoje] = useState([]);
    // Próximo horário em função do último brinde (que não seja "Nada")
    const proximoHorario = useMemo(() => {
        const ultimoValido = [...brindesHoje]
            .filter((b) => b.premio !== "Nada")
            .sort((a, b) => dayjs(b.data).valueOf() - dayjs(a.data).valueOf())[0];

        if (!ultimoValido) return null;

        const dataUltimo = dayjs(ultimoValido.data);
        const diff = dayjs().diff(dataUltimo, "minute");
        const minutosRestantes = 180 - diff; // 3h
        return minutosRestantes > 0 ? minutosRestantes : null;
    }, [brindesHoje]);
    // Tentativas restantes no dia (qualquer giro conta, inclusive "Nada")
    const tentativasRestantes = useMemo(() => {
        const usados = Array.isArray(brindesHoje) ? brindesHoje.length : 0;
        return Math.max(0, 3 - usados);
    }, [brindesHoje]);
    // Carrega do localStorage ao abrir a página
    useEffect(() => {
        setBrindesHoje(getBrindesDeHoje());
    }, []);
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
                    <p className="font-bold text-2xl">{tentativasRestantes}</p>

                </div>
            </header>


         <section className="mb-12">
  {brindesHoje.length >= 3 ? (
    // Botão alternativo quando atingiu o limite
    <button
      disabled
      className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg cursor-not-allowed text-[2.5vh]"
    //   style={{
    //     boxShadow: `
    //       inset 0 0 14px rgba(43, 43, 43, 0.6),
    //       0 9px 100px rgba(22, 22, 22, 0.8)
    //     `,
    //   }}
    >
      🚫 Limite de giros atingido
    </button>
  ) : (
    // Botão normal para girar
    <button
      onClick={() => router.push("/pages/user/video")}
      className="animate-pulse-strong w-full py-4 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:bg-purple-900 hover:scale-[1.02] transition-all duration-300 text-[2.5vh]"
      style={{
        boxShadow: `
          inset 0 0 14px rgba(43, 43, 43, 0.6),
          0 9px 100px rgba(22, 22, 22, 0.8)
        `,
      }}
    >
      🎲 Girar a Roleta
    </button>
  )}
</section>


            <section className="rounded-xl shadow " style={{
                boxShadow: `
                                inset 0 0 14px rgba(43, 43, 43, 0.6),
                                0 9px 100px rgba(22, 22, 22, 0.8)
                              `
                ,
            }}>
                {/* Status do dia de hoje */}
                <div className=" bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-[2.7vh] text-white">
                    {brindesHoje.length === 0 ? (
                        <p className="text-gray-300">Você ainda não girou a roleta hoje.</p>
                    ) : brindesHoje.length >= 3 ? (
                        <>
                            <p className="mb-2 text-[#f9f9f9] font-semibold">
                                Você atingiu o limite de 3 giros hoje.
                            </p>
                            <ul className="space-y-1 text-gray-300">
                                <p className="text-white mt-1">Brindes de hoje:</p>
                                {brindesHoje.map((item, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>
                                            {dayjs.utc(item.data) // lê a string UTC
                                                .tz(TIMEZONE)       // converte para Brasília
                                                .format("DD/MM/YYYY HH:mm")}
                                        </span>
                                        <span className="font-medium">{item.premio}</span>
                                    </li>
                                ))}

                            </ul>

                        </>
                    ) : proximoHorario ? (<>
                        <p className="text-yellow-400">
                            Você já girou a roleta. Aguarde <strong>{proximoHorario} minutos</strong> para tentar novamente.
                        </p>
                        <ul className="space-y-1 text-gray-300">
                            <p className="text-white mt-1">Brindes de hoje:</p>
                            {brindesHoje.map((item, index) => (
                                <>

                                    <li key={index} className="flex justify-between">
                                        <span>{item.data}</span>
                                        <span className="font-medium">{item.premio}</span>
                                    </li>
                                </>
                            ))}
                        </ul>
                    </>


                    ) : (
                        <>
                            <p className="text-green-400">Você já pode girar novamente!</p>
                            <ul className="space-y-1 text-gray-300">
                                <p className="text-white mt-1">Brindes de hoje:</p>
                                {brindesHoje.map((item, index) => (
                                    <>

                                        <li key={index} className="flex justify-between">
                                            <span>{item.data}</span>
                                            <span className="font-medium">{item.premio}</span>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </>

                    )}
                </div>
            </section>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0  bg-opacity-90 z-50 flex flex-col justify-center items-center text-center p-8"
                        style={{ background: "radial-gradient(circle at center, #cfcfcf 0%, #3a5f8a 100%)" }}
                    >
                        <div className="fixed inset-0 z-50 bg-opacity-90 text-left" style={{ background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 150%)" }}>
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
