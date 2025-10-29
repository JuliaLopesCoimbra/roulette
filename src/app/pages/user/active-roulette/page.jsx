"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "../../../../utils/api";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getUserToken, clearUserToken } from "../../../../utils/auth";


export default function ActiveRoulettePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);
   const [user, setUser] = useState(null);
 const [loadingUser, setLoadingUser] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setServerMsg(null);
    try {
      // PUT /active-roulette { status: true }
      const resp = await api.updateActiveRoulette({ status: true });

      if (resp?.status === true) {
        router.push("/pages/user/dashboard");
      } else {
        setServerMsg("Falha ao ativar roleta. Tente novamente.");
      }
    } catch (err) {
      if (err?.status === 401) {
        router.replace("/pages/user/welcome?redirectTo=/pages/user/active-roulette");
        return;
      }
      setServerMsg("Não foi possível ativar agora. Tente novamente em instantes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = code.trim().length > 0 && !loading;
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
  return (
    <div className="relative min-h-screen text-white">
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
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
        }}
      />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center px-5">
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
        >
          <h1 className="text-xl font-semibold tracking-tight">Ativar Roleta</h1>
          <p className="mt-2 text-sm text-white/80">
            Insira o código do seu ingresso Lollapalooza e ative sua roleta.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wide text-white/70">
                Código do ingresso
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex.: LOLLA-2025-ABCD1234"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none ring-0 transition focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${canSubmit ? "bg-white/90 text-gray-900 hover:bg-white" : "cursor-not-allowed bg-white/30 text-white/60"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ativando…
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Ativar roleta
                </>
              )}
            </button>
          </form>

          {serverMsg && (
            <div className="mt-4 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90">
              {serverMsg}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
