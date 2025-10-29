"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Header from "../../../../components/header/Header";
import { api } from "../../../../utils/api";
import { setUserToken } from "../../../../utils/auth";

export default function SignIn() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp?.get("redirectTo") || "/pages/user/home";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, register, reset, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // backend espera { email, password }
      const res = await api.login({ email: data.email?.trim(), password: data.senha });

      const token = res?.access_token || res?.data?.access_token;
      if (!token) throw new Error("Token não retornado.");

      setUserToken(token);
      toast.success("Login realizado!");
      reset();
      router.replace(redirectTo);
    } catch (err) {
      // --- tenta achar uma mensagem útil, priorizando `detail` do backend ---
      let message = "Falha no login";

      // Axios
      if (err?.response) {
        const r = err.response;
        // tenta em vários formatos comuns
        message =
          r.data?.detail ||
          r.data?.message ||
          (typeof r.data === "string" ? r.data : null) ||
          (r.status === 401
            ? "Credenciais inválidas"
            : `Erro ${r.status}: não foi possível entrar`);
      }
      // Fetch (Response) que você tenha repassado
      else if (err?.status) {
        message =
          err?.detail ||
          (err.status === 401 ? "Credenciais inválidas" : `Erro ${err.status}`);
      }
      // Erro genérico (ex.: rede)
      else if (err?.message) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

 return (
  <div className="relative h-screen w-screen overflow-hidden">
    {/* <Header /> */}

    {/* Background bonito com animação leve */}
    <motion.div
      {...fadeIn(0)}
      className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
      }}
    >
      {/* CARD DO FORM */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md  backdrop-blur-xl px-8 py-10 rounded-2xl shadow-2xl border border-[#ffffff0d] text-white"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/img/logo/gluck_logo.png"
            alt="Muscle Club"
            className="h-25 w-auto opacity-95"
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-center text-2xl font-semibold mb-8 tracking-wide">
          Acesse sua conta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm text-gray-200">Email</label>
            <input
              {...register("email", { required: "Campo obrigatório" })}
              className="w-full p-3 rounded-lg bg-[#2c2c2e] text-white placeholder:text-gray-400 border border-transparent focus:border-purple-500 focus:outline-none transition"
              placeholder="exemplo@email.com"
              autoComplete="off"
              type="email"
            />
            {errors.email && <p className="text-[#ef4444] text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-200">Senha</label>
            <input
              {...register("senha", { required: "Campo obrigatório" })}
              className="w-full p-3 rounded-lg bg-[#2c2c2e] text-white placeholder:text-gray-400 border border-transparent focus:border-purple-500 focus:outline-none transition"
              placeholder="••••••••"
              type="password"
              autoComplete="off"
            />
            {errors.senha && <p className="text-[#ef4444] text-sm">{errors.senha.message}</p>}
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-60
              bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-sm text-gray-300 text-center mt-3">
            Não tem conta?{" "}
            <a href="/pages/user/signUp" className="text-purple-400 font-semibold hover:underline">
              Registre-se
            </a>
          </p>
        </form>
      </motion.div>
    </motion.div>
  </div>
);

}
