"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Menu, LogOut, History, Gift, ChevronRight } from "lucide-react";
import prizes from "../../../../components/prizes/prizes";
import { getUserToken, clearUserToken } from "../../../../utils/auth";

dayjs.extend(customParseFormat);

// mapa para traduzir status (igual fizemos no dashboard)
const STATUS_LABELS = {
  reserved: "Reservado",
  redeemed: "Retirado",
  canceled: "Cancelado",
};

export default function Dashboard() {
  const router = useRouter();
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // histórico real vindo do backend
  const [historico, setHistorico] = useState([]);
  const [historicoLoading, setHistoricoLoading] = useState(true);
  const [historicoError, setHistoricoError] = useState(null);

  // carrega perfil do usuário
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
      return;
    }

    import("../../../../utils/api")
      .then(({ api }) => {
        return api.me();
      })
      .then((data) => {
        setUser({
          nome: data.name || "Usuário",
          email: data.email || "",
          avatarUrl: "/img/avatar.jpg",
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar perfil:", err);
        clearUserToken();
        router.replace("/pages/user/signIn");
      });
  }, [router]);

  // carrega histórico quando a data mudar
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
      return;
    }

    const dateStr = dayjs(dataSelecionada).format("YYYY-MM-DD");

    setHistoricoLoading(true);
    setHistoricoError(null);

    import("../../../../utils/api")
      .then(({ api }) => api.myPrizes(dateStr, dateStr))
      .then((data) => {
        // data é a lista retornada pelo backend
        // ex: [{ prize_redemption_id, spin_id, prize_id, name_prize, status, created_at }]
        setHistorico(data || []);
      })
      .catch((err) => {
        console.error("Erro ao buscar histórico de prêmios:", err);
        setHistoricoError(
          err?.message || "Não foi possível carregar o histórico."
        );
        setHistorico([]);
      })
      .finally(() => {
        setHistoricoLoading(false);
      });
  }, [dataSelecionada, router]);

  const go = (href) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <div
      className="min-h-screen p-4 text-gray-100"
    style={{
        background: `
    radial-gradient(circle at top left, rgba(255,0,102,0.7), transparent 60%),
    radial-gradient(circle at bottom right, rgba(255,90,150,0.75), transparent 60%),
    linear-gradient(135deg, #ff0059 0%, #fb4668 60%)
  `
      }}
    >
    <header className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6">
  <div className="flex items-center justify-between">
    {/* Bloco do usuário */}
    <div className="flex items-center gap-3">
      {user ? (
        <>
          {/* Avatar maior com borda bonita */}
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,#ffffff66,#ffb3e6,#7c3aed,#ffb3e6,#ffffff66)] blur-[2px] opacity-80" />
            <img
              src={user.avatarUrl}
              alt={user.nome}
              className="relative h-14 w-14 rounded-full object-cover ring-2 ring-white/60 shadow-lg"
            />
          </div>

          {/* Textos */}
          <div className="flex flex-col">
            <p className="text-xs text-white/80">
              Bem vindo de volta,
            </p>
            <p className="text-lg font-semibold leading-tight">
              {user.nome}!
            </p>
            <p className="mt-0.5 text-[11px] text-white/70">
              {user.email}
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 animate-pulse rounded-full bg-white/10" />
          <div className="space-y-1">
            <div className="h-3 w-32 animate-pulse rounded bg-white/15" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
          </div>
        </div>
      )}
    </div>

    {/* Botão de menu à direita */}
    <button
      onClick={() => setMenuOpen(true)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition shadow-lg backdrop-blur-sm"
    >
      <Menu className="h-5 w-5" />
    </button>
  </div>
</header>


 <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
  {/* Topo: título + seletor de data */}
  <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md shadow-[0_20px_45px_rgba(0,0,0,0.55)]">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Título + data atual */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 border border-white/15">
          <History className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-semibold text-white">
            Histórico de Prêmios
          </h1>
          <p className="text-xs text-white/70">
            Visualize os brindes recebidos no dia selecionado
          </p>
          <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/80 border border-white/10">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Dia selecionado:{" "}
            <span className="font-medium">
              {dayjs(dataSelecionada).format("DD/MM/YYYY")}
            </span>
          </p>
        </div>
      </div>

      {/* DatePicker estilizado */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-100">
          Escolher data:
        </span>
        <div className="z-50 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white shadow-inner">
         <DatePicker
  selected={dataSelecionada}
  onChange={(date) => setDataSelecionada(date)}
  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
  dateFormat="dd/MM/yyyy"
  portalId="react-datepicker-portal"
/>

          
        </div>
      </div>
    </div>
  </section>

  {/* Lista de prêmios do dia */}
  <section className="mt-6 rounded-2xl px-4 py-4">
    {historicoLoading ? (
      <p className="py-6 text-center text-sm text-white/70">
        Carregando prêmios deste dia...
      </p>
    ) : historicoError ? (
      <p className="py-6 text-center text-sm text-red-300">
        {historicoError}
      </p>
    ) : historico.length === 0 ? (
      <p className="py-6 text-center text-sm text-white/70">
        Nenhum brinde neste dia.
      </p>
    ) : (
      <ul className="space-y-3">
        {historico.map((item) => {
          const prizeMatch = prizes.find(
            (p) => p.name === item.name_prize
          );
          const image = prizeMatch?.image || "/img/prizes/default.png";
          const statusLabel =
            STATUS_LABELS[item.status] || item.status || "";

          const statusColor =
            item.status === "redeemed"
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
              : item.status === "reserved"
              ? "bg-amber-500/15 text-amber-200 border-amber-400/30"
              : item.status === "canceled"
              ? "bg-red-500/15 text-red-200 border-red-400/30"
              : "bg-white/10 text-white/80 border-white/20";

          return (
            <li
              key={item.prize_redemption_id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm"
            >
              {/* Imagem do prêmio */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 border border-white/15">
                <img
                  src={image}
                  alt={item.name_prize}
                  className="h-8 w-8 object-contain"
                />
              </div>

              {/* Infos */}
              <div className="flex flex-1 flex-col">
                <span className="text-[11px] text-white/60">
                  {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                </span>
                <span className="text-sm font-semibold text-white">
                  {item.name_prize}
                </span>
              </div>

              {/* Status pill */}
              {statusLabel && (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusColor}`}
                >
                  {statusLabel}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    )}
  </section>
</main>


      {/* DRAWER MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 "
            style={{
        background: `
    radial-gradient(circle at top left, rgba(255,0,102,0.7), transparent 60%),
    radial-gradient(circle at bottom right, rgba(255,90,150,0.75), transparent 60%),
    linear-gradient(135deg, #ff0059 0%, #fb4668 60%)
  `
      }}
    
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 h-full w-[85%] max-w-sm border-r border-white/10 backdrop-blur-xl p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">
                    {user?.email || ""}
                  </p>
                  <p className="text-sm font-medium">
                    {user?.nome || "Usuário"}
                  </p>
                </div>
                {user && (
                  <img
                    src={user.avatarUrl}
                    alt={user.nome}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                  />
                )}
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => go("/pages/user/dashboard")}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/30 px-4 py-3 text-left hover:bg-white/10"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </button>
                <button
                  onClick={() => go("/pages/user/historico")}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/30 px-4 py-3 text-left hover:bg-white/10"
                >
                  <span>Histórico de Prêmios</span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </button>
              </nav>

              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  onClick={() => {
                    clearUserToken();
                    go("/pages/user/signIn");
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/30 px-4 py-3 text-left text-white hover:bg-white/10"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </span>
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
