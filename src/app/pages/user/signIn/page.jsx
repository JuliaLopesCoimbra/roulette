"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
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
      const res = await api.login({
        email: data.email?.trim(),
        password: data.senha,
      });

      const token = res?.access_token || res?.data?.access_token;
      if (!token) throw new Error("Token não retornado.");

      setUserToken(token);
      toast.success("Login realizado!");
      reset();
      router.replace(redirectTo);
    } catch (err) {
      let msg = "Falha no login";

      if (err?.response) {
        const r = err.response;
        msg =
          r.data?.detail ||
          r.data?.message ||
          (typeof r.data === "string" ? r.data : null) ||
          (r.status === 401 ? "Credenciais inválidas" : `Erro ${r.status}`);
      }

      toast.error(msg);
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
    <div className="relative min-h-screen w-full grid lg:grid-cols-2 overflow-hidden">

      {/* IMAGEM MOBILE/TABLET (acima do form) */}
      {/* <motion.div
        {...fadeIn(0)}
        className="block lg:hidden relative w-full h-42 sm:h-50"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/fundo/bg-login.png')" }}
        />

        {/* sombra fade bottom */}
        {/* <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" /> */}
      {/* </motion.div> */}


      {/* IMAGEM DESKTOP (lado esquerdo) */}
      <motion.div
        {...fadeIn(0)}
        className="hidden lg:block relative bg-cover bg-center"
        style={{ backgroundImage: "url('/img/fundo/bg-login.png')" }}
      >
        {/* sombra para suavizar o corte */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />
       </motion.div> 


      {/* ÁREA DO FORM */}
      <motion.div
        {...fadeIn(0.15)}
        className="flex flex-col items-center justify-center px-6 py-12 backdrop-blur-xl"
        style={{
        background: `
    radial-gradient(circle at top left, rgba(255,0,102,0.7), transparent 60%),
    radial-gradient(circle at bottom right, rgba(255,90,150,0.75), transparent 60%),
    linear-gradient(135deg, #ff0059 0%, #fb4668 60%)
  `
      }}
    >
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <img
              src="/img/logo/adword.png"
              alt="Logo"
              className="h-15 opacity-95"
            />
          </div>

          <h2 className="text-center text-2xl font-semibold mb-8 tracking-wide text-white">
            Acesse sua conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                {...register("email", { required: "Campo obrigatório" })}
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder:text-white border border-transparent focus:border-[#fb4667] focus:outline-none transition"
                placeholder="exemplo@email.com"
                type="email"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-300">Senha</label>
              <input
                {...register("senha", { required: "Campo obrigatório" })}
                className="w-full p-3 rounded-lg bg-white/30 text-white placeholder:text-white border border-transparent focus:border-[#fb4667] focus:outline-none transition"
                placeholder="••••••••"
                type="password"
              />
              {errors.senha && <p className="text-red-400 text-sm">{errors.senha.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#f7bbc6] to-[#e44864] hover:opacity-90 transition disabled:opacity-60"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            <p className="text-sm text-white text-center mt-3">
              Não tem conta?{" "}
              <a href="/pages/user/signUp" className="text-[#881026] font-semibold hover:underline">
                Registre-se
              </a>
            </p>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
