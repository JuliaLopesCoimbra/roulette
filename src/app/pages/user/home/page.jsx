"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";
import { api } from "../../../../utils/api";
import { getUserToken, clearUserToken } from "../../../../utils/auth";

export default function HomeUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Proteção + carregar usuário autenticado
  useEffect(() => {
    const tok = getUserToken();
    if (!tok) {
      router.replace("/pages/user/home?redirectTo=/pages/user/home");
      return;
    }
    (async () => {
      try {
        const me = await api.me();
        setUser({
          nome: me?.name || "Usuário",
          email: me?.email || "",
          avatarUrl: "/img/avatar.jpg",
        });
      } catch (err) {
        console.error("Erro ao buscar /me:", err);
        clearUserToken();
        router.replace("/pages/user/signIn?redirectTo=/pages/user/home");
      } finally {
        setLoadingUser(false);
      }
    })();
  }, [router]);

  const onPreRoletaClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // GET /active-roulette
      const resp = await api.activeRoulette(); 
      // resp: { status: boolean, activated_at: string | null }
      if (resp?.status === true) {
        router.push("/pages/user/dashboard");
      } else {
        router.push("/pages/user/active-roulette");
      }
    } catch (err) {
      if (err?.status === 401) {
        router.replace("/pages/user/signIn?redirectTo=/pages/user/home");
        return;
      }
      console.error(err);
      alert("Erro ao verificar status da roleta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* BG minimalista */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Header (perfil real) */}
      <header className="relative mx-auto w-full max-w-2xl px-5 pt-5">
        <div className="flex items-center justify-end gap-3">
          {loadingUser ? (
            <div className="h-10 w-40 animate-pulse rounded-md bg-white/10" />
          ) : (
            <>
              <div className="text-right">
                <p className="text-xs/4 text-white/70">{user?.email}</p>
                <p className="text-sm font-medium">{user?.nome}</p>
              </div>
              <img
                src={user?.avatarUrl || "/img/avatar/default.png"}
                alt={user?.nome || "Avatar"}
                className="h-10 w-10 rounded-full border border-white/30 object-cover shadow-sm"
              />
            </>
          )}
        </div>
      </header>

      {/* Conteúdo central */}
      <main className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-2xl items-center px-5">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <h1 className="mb-4 text-lg font-semibold tracking-tight">Escolha uma opção</h1>

          <div className="grid gap-3">
            {/* Pré Roleta Lolla */}
            <button
              onClick={onPreRoletaClick}
              disabled={loading || loadingUser}
              className={`group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4 text-left transition focus:outline-none
                ${loading || loadingUser ? "bg-white/5 opacity-70 cursor-wait" : "bg-white/5 hover:bg-white/10 focus:ring-2 focus:ring-white/30"}`}
            >
              <div className="flex flex-col">
                <span className="text-base font-semibold">
                  {loading ? "Verificando..." : "Pré Roleta Lolla"}
                </span>
                <span className="mt-0.5 text-sm text-white/70">Aqueça e valide sua entrada</span>
              </div>
              <ChevronRight className="h-5 w-5 opacity-80 transition group-hover:translate-x-0.5" />
            </button>

            {/* Roleta Oficial (desabilitado) */}
            <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 opacity-60">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">Roleta Oficial</span>
                  <Lock className="h-4 w-4" aria-hidden />
                </div>
                <span className="mt-0.5 text-sm text-white/70">Em breve</span>
              </div>
              <button
                disabled
                aria-disabled="true"
                title="Em breve"
                className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
              >
                Indisponível
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-xs text-white/60">
            <span>v1.0 • Lolla Experience</span>
            <span>Suporte • FAQ</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
