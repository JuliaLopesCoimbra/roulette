"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "../../../../utils/api";
import { setClientToken } from "../../../../utils/auth";

export default function ClientSignIn() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const res = await api.clientLogin({ email: data.email, password: data.password });
      const token = res?.access_token;
      if (!token) throw new Error("Credenciais inválidas");

      // salva cookie (pro middleware) e localStorage (opcional front)
      setClientToken(token);

      toast.success("Login realizado!");
      reset();
      router.replace("/pages/client/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Falha no login. Verifique suas credenciais.";

      setError("password", { type: "manual", message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fade = (d = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: d },
  });

  return (
    <div
      className="min-h-[100svh] w-full overflow-hidden relative"
        style={{
          background: `
      radial-gradient(1600px 900px at 15% 15%, rgba(var(--theme-pink), 0.70), transparent 70%),
      radial-gradient(1300px 750px at 85% 25%, rgba(var(--theme-pink), 0.55), transparent 70%),
      radial-gradient(1100px 650px at 50% 90%, rgba(var(--theme-pink), 0.45), transparent 70%),
      #000000
    `
        }}
    >
      {/* <Header /> se quiser manter */}

      {/* textura sutil */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* centro */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl items-center justify-center px-4">
        <motion.div
          {...fade(0.05)}
          className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_1px_0_rgba(255,255,255,0.05),0_30px_60px_-15px_rgba(0,0,0,0.6)]"
        >
          {/* logo / título */}
          <motion.div {...fade(0.1)} className="mb-6 text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/img/logo/adword.png"
                alt="Muscle Club"
                className="h-15 w-auto opacity-95"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">Área do Cliente</h1>
            {/* <h2 className="text-xl font-semibold text-white">Entrar</h2> */}
            <p className="mt-1 text-sm text-white/60">
              Acesse sua conta para continuar
            </p>
          </motion.div>

          {/* formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <motion.div {...fade(0.15)} className="space-y-1.5">
              <label className="text-xs text-white/70">Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-xl bg-[#1b1f2a] text-white placeholder:text-white/40 border border-white/10 focus:border-[#fb4667] focus:outline-none px-3 py-2.5 transition"
                {...register("email", {
                  required: "Campo obrigatório",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
                })}
              />
              {errors.email && (
                <p className="text-[12px] text-rose-400">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Senha */}
            <motion.div {...fade(0.2)} className="space-y-1.5">
              <label className="text-xs text-white/70">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#1b1f2a] text-white placeholder:text-white/40 border border-white/10 focus:border-[#fb4667] focus:outline-none px-3 py-2.5 transition pr-10"
                  {...register("password", { required: "Campo obrigatório" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 text-xs"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-rose-400">{errors.password.message}</p>
              )}
            </motion.div>

            {/* Ações */}
            <motion.div {...fade(0.25)} className="mt-2 flex items-center justify-between">
              <a href="/pages/client/forgot" className="text-xs text-white/70 hover:text-white/90 underline-offset-2 hover:underline">
                Esqueci minha senha
              </a>
              {/* espaço reservado pra lembrar-me se quiser */}
            </motion.div>

            {/* Botão */}
            <motion.button
              {...fade(0.3)}
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-[#fb4667] text-white font-medium py-2.75 transition hover:bg-[#fc2f55] disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </motion.button>

            {/* rodapé pequeno */}
            <motion.p {...fade(0.35)} className="text-center text-xs text-white/60 mt-3">
              Não tem conta?{" "}
              <a
                href="/pages/client/signUpClient"
                className="text-[#fb4667] hover:text-[#fa234a] font-medium"
              >
                Registre-se
              </a>
            </motion.p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
