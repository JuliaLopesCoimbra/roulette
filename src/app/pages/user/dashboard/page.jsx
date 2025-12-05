"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Menu, LogOut, History, Gift, ChevronRight, Clock } from "lucide-react";
import { getUserToken, clearUserToken } from "../../../../utils/auth";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE = "America/Sao_Paulo";
const STATUS_LABELS = {
  reserved: "Reservado",
  redeemed: "Retirado",
  canceled: "Cancelado",
};


function formatZ(dt) {
  if (!dt) return "—";
  return dayjs.utc(dt).tz(TIMEZONE).format("DD/MM/YYYY HH:mm");
}

export default function Dashboard() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // autenticação + perfil + dashboard
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/signIn?redirectTo=/pages/user/dashboard");
      return;
    }

    import("../../../../utils/api")
      .then(({ api }) => {
        // carrega perfil + homepage em paralelo
        return Promise.all([
          api.me(),
          api.homepageUser(),
        ]);
      })
      .then(([meData, homeData]) => {
        setUser({
          nome: meData.name || "Usuário",
          email: meData.email || "",
          avatarUrl: "/img/avatar.jpg",
        });
        setDashboardData(homeData);
        setDashboardError(null);
      })
      .catch((err) => {
        console.error("Erro ao carregar dashboard:", err);
        setDashboardError(err?.message || "Erro ao carregar dados da roleta.");
        clearUserToken();
        router.replace("/pages/user/signIn");
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  }, [router]);

  // derivando valores a partir do /homepageuser
  const spinStatus = dashboardData?.spin_status || null;
  const lastPrize = dashboardData?.last_prize || null;
  const todayPrizes = dashboardData?.today_prizes || [];

  const tentativasRestantes = spinStatus ? spinStatus.remaining_today : 0;
  const maxTentativas = spinStatus ? spinStatus.max_spins_per_day : 3;

  const proximoHorarioMin = useMemo(() => {
    if (!spinStatus) return null;
    if (spinStatus.status !== "cooldown") return null;
    if (spinStatus.cooldown_seconds_remaining == null) return null;
    const mins = Math.ceil(spinStatus.cooldown_seconds_remaining / 60);
    return mins > 0 ? mins : null;
  }, [spinStatus]);

  const canSpin = spinStatus ? spinStatus.status === "available" : false;
  const isDailyLimit = spinStatus ? spinStatus.status === "daily_limit" : false;

  const go = (href) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <div className="relative min-h-[100svh] md:min-h-[100dvh] text-black overflow-hidden "
      style={{
        background:"white"
      }}>

      <header className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Bloco do usuário */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Avatar maior com borda bonita */}
                <div className="relative">
                  {/* Glow / borda em degradê */}
                  <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,#ffffff66,#ffb3e6,#7c3aed,#ffb3e6,#ffffff66)] blur-[2px] opacity-80" />
                  <img
                    src={user.avatarUrl}
                    alt={user.nome}
                    className="relative h-14 w-14 rounded-full object-cover ring-2 ring-white/60 shadow-lg"
                  />
                </div>

                {/* Textos */}
                <div className="flex flex-col">
                  <p className="text-xs text-black/80">
                    Bem vindo de volta,
                  </p>
                  <p className="text-lg font-semibold leading-tight">
                    {user.nome}!
                  </p>
                  <p className="mt-0.5 text-[11px] text-black/70">
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

          {/* Botão de menu (mantido, mas agora fica à direita) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition shadow-lg backdrop-blur-sm"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>


      {/* Conteúdo */}
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
        <div className="relative w-full mt-2">

  {/* Ondas atrás (suave, blur, luz difusa) */}
  <div className="pointer-events-none absolute inset-0 -top-10 opacity-70 blur-xl">
    <img
      src="/img/dashboard/waves-lines.svg"
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="relative z-10 mt-6 flex flex-col items-center text-center"
    style={{
      background: `
      white
      `
    }}
  >
    {/* Tentativas restantes */}
    <p className="text-sm text-black/70">Tentativas restantes</p>

    <p className="mt-1 text-[68px] font-extrabold leading-none bg-gradient-to-br from-black via-black/90 to-black/70 bg-clip-text text-transparent drop-shadow-lg">
      {dashboardLoading ? "—" : tentativasRestantes}
    </p>

    <p className="text-xs text-black/60 -mt-1">
      Máximo de {maxTentativas} giros por dia
    </p>

    {/* Próximo giro */}
    <div className="mt-6">
      <p className="text-xs text-black/70 flex items-center justify-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        Próximo giro
      </p>
      <p className="mt-1 text-xl font-semibold">
        {dashboardLoading
          ? "Carregando..."
          : isDailyLimit
          ? "Amanhã"
          : proximoHorarioMin
          ? `${proximoHorarioMin} min`
          : "Disponível"}
      </p>
    </div>

    {/* Último prêmio */}
    <div className="mt-6">
      <p className="text-xs text-black/70 flex items-center justify-center gap-1">
        <Gift className="h-3.5 w-3.5" />
        Último prêmio
      </p>

      {dashboardLoading ? (
        <p className="mt-1 text-lg font-medium">Carregando...</p>
      ) : lastPrize ? (
        <>
          <p className="mt-1 text-lg font-semibold">
            {lastPrize.name_prize}
          </p>
          <p className="mt-0.5 text-xs text-black/60">
            {formatZ(lastPrize.created_at)} • Status:{" "}
            {STATUS_LABELS[lastPrize.status] || lastPrize.status}
          </p>
        </>
      ) : (
        <p className="mt-1 text-lg font-medium">—</p>
      )}
    </div>

  </motion.section>
</div>


        {/* CTA principal */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={() => (canSpin ? router.push("/pages/user/video") : null)}
            disabled={!canSpin}
            className={`
      group relative inline-flex w-full max-w-sm items-center justify-between 
      rounded-full px-5 py-4 text-left transition
      
${canSpin
  ? "cursor-pointer bg-[#E5E5E5] hover:bg-[#D5D5D5]"
  : "cursor-not-allowed bg-white/10 opacity-60"
}

    `}
          >
            {/* brilho suave no botão */}
            {canSpin && (
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.35),transparent_55%)] opacity-70" />
            )}

            <div className="relative flex flex-col">
              <p
                className={`
          text-base font-extrabold tracking-wide
          ${canSpin ? "text-black" : "text-black/80"}
        `}
              >
                {canSpin
                  ? "Girar a Roleta"
                  : isDailyLimit
                    ? "Limite de giros atingido"
                    : proximoHorarioMin
                      ? `Aguarde ${proximoHorarioMin} min`
                      : "Indisponível"}
              </p>

              <p className="mt-0.5 text-xs text-black/80">
                Ganhe prêmios e acompanhe seu histórico
              </p>
            </div>

            <div className="relative flex items-center gap-2">
              {canSpin && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                  GO
                </span>
              )}

              <ChevronRight
                className={`
          h-6 w-6 transition-transform duration-300
          ${canSpin ? "group-hover:translate-x-1" : "opacity-50"}
        `}
              />
            </div>
          </button>
        </motion.section>


        {/* Brindes de hoje - visual de gráfico */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 rounded-2xl "
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/20 border border-white/10">
                <History className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">Brindes de hoje</h2>
                <p className="text-[11px] text-black/70">
                  {todayPrizes.length} giro{todayPrizes.length === 1 ? "" : "s"} hoje
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/pages/user/historico")}
              className="text-[11px] text-black/75 underline-offset-2 hover:underline"
            >
              ver histórico completo
            </button>
          </div>

          {dashboardLoading ? (
            <p className="text-black/70 text-sm">Carregando...</p>
          ) : todayPrizes.length === 0 ? (
            <p className="text-black/75 text-sm">
              Você ainda não girou a roleta hoje.
            </p>
          ) : (
            <>
              {/* “Gráfico” de barras */}
              <div className="mt-2 overflow-x-auto">
                <div className="flex items-end gap-4 min-w-full pb-2">
                  {todayPrizes.map((item, index) => (
                    <div
                      key={item.prize_redemption_id}
                      className="flex min-w-[56px] flex-col items-center gap-1"
                    >
                      {/* Barra vertical */}
                      <div className="flex h-24 w-8 items-end rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-[#fb4668] via-[#ff7af2] to-[#8b5cf6]"
                          style={{
                            // altura só pra efeito visual
                            height: `${45 + (index % 4) * 12}%`,
                          }}
                        />
                      </div>
                      {/* Horário */}
                      <span className="text-[10px] text-black/60">
                        {formatZ(item.created_at)}
                      </span>
                      {/* Nome do prêmio */}
                      <span className="max-w-[80px] truncate text-[11px] font-medium text-black">
                        {item.name_prize}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.section>


        {dashboardError && (
          <p className="mt-3 text-xs text-red-300">
            {dashboardError}
          </p>
        )}
      </main>

      {/* Drawer menu */}
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
              className="relative z-10 h-full w-[85%] max-w-sm border-r border-white/10 bg-[#fb4667]/0 backdrop-blur-xl p-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-black/70">
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

              <div className="mt-6 border-t border-white/30 pt-4">
                <button
                  onClick={() => {
                    clearUserToken();
                    go("/pages/user/signIn");
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/30 px-4 py-3 text-left text-black hover:bg-white/10"
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
