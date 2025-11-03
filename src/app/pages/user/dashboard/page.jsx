"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Menu, LogOut, History, Gift, ChevronRight, Clock } from "lucide-react";
import { getBrindesDeHoje } from "../../../../utils/brindesStorage";
import { getUserToken, clearUserToken } from "../../../../utils/auth";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Sao_Paulo";

// util de data
function formatZ(dt) {
  // aceita string ISO/UTC armazenada
  return dayjs.utc(dt).tz(TIMEZONE).format("DD/MM/YYYY HH:mm");
}

export default function Dashboard() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [brindesHoje, setBrindesHoje] = useState([]);
  const [user, setUser] = useState(null);

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


  // carrega histórico do dia
  useEffect(() => { setBrindesHoje(getBrindesDeHoje()); }, []);

  // proteção client-side (redundância ao middleware)
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
  }, [router]);

  // tentativas e próxima janela
  const tentativasRestantes = useMemo(() => Math.max(0, 3 - (brindesHoje?.length || 0)), [brindesHoje]);

  const proximoHorarioMin = useMemo(() => {
    const ultimoValido = [...brindesHoje]
      .filter((b) => b.premio !== "Nada")
      .sort((a, b) => dayjs(b.data).valueOf() - dayjs(a.data).valueOf())[0];
    if (!ultimoValido) return null;
    const dataUltimo = dayjs(ultimoValido.data);
    const diff = dayjs().diff(dataUltimo, "minute");
    const minutosRestantes = 0.1 - diff; // 3h
    return minutosRestantes > 0 ? minutosRestantes : null;
  }, [brindesHoje]);

  const canSpin = tentativasRestantes > 0 && !proximoHorarioMin;

  const go = (href) => { setMenuOpen(false); router.push(href); };

  return (
   <div className="relative min-h-[100svh] md:min-h-[100dvh] text-white overflow-hidden bg-[#0f172a]">

      {/* BG em camadas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 " style={{
  background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
}} />
        <div className="absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-50" style={{
  background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
}} />
        <div className="absolute -right-1/4 -bottom-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40" style={{background:"radial-gradient(closest-side, rgba(99,102,241,0.35), transparent 70%)"}} />
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M36 0H0V36" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

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


      {/* Conteúdo */}
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
        {/* Cards de status */}
        <motion.section initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Tentativas */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.05),0_30px_60px_-15px_rgba(0,0,0,0.45)]">
            <p className="text-xs text-white/70">Tentativas restantes</p>
            <p className="mt-1 text-3xl font-bold leading-none">{tentativasRestantes}</p>
            <p className="mt-1 text-[11px] text-white/60">Máximo de 3 giros por dia</p>
          </div>

          {/* Próximo horário */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="flex items-center gap-1 text-xs text-white/70"><Clock className="h-3.5 w-3.5"/>Próximo giro</p>
            <p className="mt-1 text-2xl font-semibold leading-none">{proximoHorarioMin ? `${proximoHorarioMin} min` : "Disponível"}</p>
            <p className="mt-1 text-[11px] text-white/60">Intervalo mínimo de 3 horas</p>
          </div>

          {/* Último prêmio */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="flex items-center gap-1 text-xs text-white/70"><Gift className="h-3.5 w-3.5"/>Último prêmio</p>
            {brindesHoje.length > 0 ? (
              <>
                <p className="mt-1 truncate text-lg font-semibold leading-none">{brindesHoje[brindesHoje.length - 1].premio}</p>
                <p className="mt-1 text-[11px] text-white/60">{formatZ(brindesHoje[brindesHoje.length - 1].data)}</p>
              </>
            ) : (
              <p className="mt-1 text-lg font-semibold leading-none">—</p>
            )}
          </div>
        </motion.section>

        {/* CTA principal */}
        <motion.section initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.4, delay:.05}} className="mt-4">
          <button
            onClick={() => canSpin ? router.push("/pages/user/video") : null}
            disabled={!canSpin}
            className={`group relative w-full overflow-hidden rounded-2xl text-left transition backdrop-blur-sm
              ${canSpin ? "cursor-pointer  focus:outline-none focus:ring-2 focus:ring-white/30" : "cursor-not-allowed border-white/10 bg-white/5 opacity-70"}`}
          >
         <div
  className={`
    flex items-center justify-between p-4 rounded-xl transition-all duration-300 relative overflow-hidden
    ${canSpin ? "cursor-pointer" : "opacity-70 cursor-not-allowed"}
  `}
  style={{
    background: canSpin
      ? "linear-gradient(90deg, rgba(251,70,103,0.35), rgba(255,0,128,0.35))"
      : "rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
    border: canSpin
      ? "1px solid rgba(251,70,103,0.8)"
      : "1px solid rgba(255,255,255,0.15)",
    boxShadow: canSpin
      ? "0 0 18px 4px rgba(251,70,103,0.55)"
      : "none",
  }}
>
  {/* Círculo de glow animado atrás */}
  {canSpin && (
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fb4667] to-[#ff0099] opacity-30 blur-3xl animate-pulse"></div>
  )}

  <div>
    <p
      className={`text-base font-extrabold tracking-wide transition
        ${canSpin ? "text-white" : "text-white/70"}
      `}
    >
      {canSpin
        ? "Girar a Roleta"
        : tentativasRestantes === 0
          ? "Limite de giros atingido"
          : `Aguarde ${proximoHorarioMin} min`}
    </p>

    <p className="mt-0.5 text-sm text-white/70">
      Ganhe prêmios e acompanhe seu histórico
    </p>
  </div>

  <ChevronRight
    className={`h-6 w-6 transition-all duration-300
      ${canSpin ? "text-white group-hover:translate-x-1" : "opacity-40"}
    `}
  />
</div>


          </button>
        </motion.section>

        {/* Histórico de hoje */}
        <motion.section initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.4, delay:.1}} className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><History className="h-4 w-4"/><h2 className="text-sm font-medium">Brindes de hoje</h2></div>
            <button onClick={() => router.push("/pages/user/historico")} className="text-xs text-white/70 underline-offset-2 hover:underline">ver histórico completo</button>
          </div>

          {brindesHoje.length === 0 ? (
            <p className="text-white/70">Você ainda não girou a roleta hoje.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {brindesHoje.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-white/80">{formatZ(item.data)}</span>
                  <span className="text-sm font-medium">{item.premio}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </main>

      {/* Drawer menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50">
            <div className="absolute inset-0 " style={{
  background: `
    radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
    radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
    radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
    #000000
  `
}}
 onClick={() => setMenuOpen(false)} />
            <motion.aside initial={{x:-320}} animate={{x:0}} exit={{x:-320}} transition={{type:"spring", stiffness:300, damping:30}}
              className="relative z-10 h-full w-[85%] max-w-sm border-r border-white/10 bg-[#fb4667]/0 backdrop-blur-xl p-5">
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
