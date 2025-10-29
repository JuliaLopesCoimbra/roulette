"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Menu, LogOut, History, Gift, ChevronRight, Clock } from "lucide-react";
import prizes from "../../../../components/prizes/prizes";
import { getUserToken, clearUserToken } from "../../../../utils/auth";

dayjs.extend(customParseFormat);

export default function Dashboard() {
    const router = useRouter();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [menuOpen, setMenuOpen] = useState(false);
    const [brindes] = useState({
        brindes: [
            // Hoje
            { data: "12/10/2025 09:00", premio: "AirPods Pro" },
            { data: "12/10/2025 12:00", premio: "IFood 10%" },
            { data: "12/10/2025 15:00", premio: "Pix R$100,00" },

            // Ontem
            { data: "13/10/2025 09:00", premio: "IFood 10%" },
            { data: "13/10/2025 12:00", premio: "Pix R$100,00" },
            { data: "13/10/2025 15:00", premio: "100% Adidas" },

            // 2 dias atrás
            { data: "14/10/2025 09:00", premio: "20% Nike" },
            { data: "14/10/2025 12:00", premio: "Pix R$100,00" },
            { data: "14/10/2025 15:00", premio: "50% Shoppe" },

            // 3 dias atrás
            { data: "15/10/2025 09:00", premio: "Pix R$100,00" },
            { data: "15/10/2025 12:00", premio: "AirPods Pro" },
            { data: "15/10/2025 15:00", premio: "10% PSN" },

            // 4 dias atrás
            { data: "16/10/2025 09:00", premio: "AirPods Pro" },
            { data: "16/10/2025 12:00", premio: "100% Adidas" },
            { data: "16/10/2025 15:00", premio: "Pix R$100,00" }
        ]
    });
    const [user, setUser] = useState(null);
    const brindesDoDia = brindes.brindes.filter((item) => {
        if (!dataSelecionada) return false;

        const dataBrinde = dayjs(item.data, "DD/MM/YYYY").format("YYYY-MM-DD");
        const dataSelecionadaFormatada = dayjs(dataSelecionada).format("YYYY-MM-DD");

        return dataBrinde === dataSelecionadaFormatada;
    });
    useEffect(() => {
        const tok = getUserToken();
        if (!tok) {
            router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
            return;
        }

        // busca informações do usuário logado
        import("../../../../utils/api").then(({ api }) => {
            api.me()
                .then((data) => setUser({
                    nome: data.name || "Usuário",
                    email: data.email || "",
                    avatarUrl: "/img/avatar.jpg", // opcional: futuramente pode vir da API
                }))
                .catch((err) => {
                    console.error("Erro ao buscar perfil:", err);
                    clearUserToken();
                    router.replace("/pages/user/signIn");
                });
        });
    }, [router]);
    const go = (href) => { setMenuOpen(false); router.push(href); };
    return (
        <div className="min-h-screen p-4 text-gray-100" style={{
            background:
                "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
        }}
        >
            <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
                <button onClick={() => setMenuOpen(true)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition">
                    <Menu className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="text-right">
                                <p className="text-xs/4 text-white/70">{user.email}</p>
                                <p className="text-sm font-medium">{user.nome}</p>
                            </div>
                            <img src={user.avatarUrl} alt={user.nome} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20 shadow" />
                        </>
                    ) : (
                        <div className="animate-pulse text-sm text-white/60">Carregando...</div>
                    )}
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
                   <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50">
                     <div className="absolute inset-0 " style={{ background: `
             radial-gradient(1000px 600px at 15% 15%, rgba(124,58,237,0.25), transparent 60%),
             radial-gradient(900px 500px at 85% 25%, rgba(34,211,238,0.18), transparent 60%),
             radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%),
             radial-gradient(circle at center, rgba(10,15,35,0.95) 0%, rgba(15,23,42,1) 100%)
           `,}}onClick={() => setMenuOpen(false)} />
                     <motion.aside initial={{x:-320}} animate={{x:0}} exit={{x:-320}} transition={{type:"spring", stiffness:300, damping:30}}
                       className="relative z-10 h-full w-[85%] max-w-sm border-r border-white/10 bg-[#0f172a]/80 backdrop-blur-xl p-5">
                       <div className="mb-6 flex items-center justify-between">
                         <div>
                           <p className="text-xs text-white/70">{user.email}</p>
                           <p className="text-sm font-medium">{user.nome}</p>
                         </div>
                         <img src={user.avatarUrl} alt={user.nome} className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20" />
                       </div>
         
                       <nav className="space-y-2">
                         <button onClick={() => go("/pages/user/dashboard")} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10">
                           <span>Dashboard</span>
                           <ChevronRight className="h-4 w-4 opacity-70" />
                         </button>
                         <button onClick={() => go("/pages/user/historico")} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10">
                           <span>Histórico de Prêmios</span>
                           <ChevronRight className="h-4 w-4 opacity-70" />
                         </button>
                       </nav>
         
                       <div className="mt-6 border-t border-white/10 pt-4">
                         <button
                           onClick={() => { clearUserToken(); go("/pages/user/signIn"); }}
                           className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-red-300 hover:bg-white/10"
                         >
                           <span className="flex items-center gap-2"><LogOut className="h-4 w-4"/>Sair</span>
                           <ChevronRight className="h-4 w-4 opacity-70" />
                         </button>
                       </div>
                     </motion.aside>
                   </motion.div>
                 )}
               </AnimatePresence>
        </div>

    );
}
