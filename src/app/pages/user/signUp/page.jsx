"use client";

import React, { useState } from "react";
import CadastroFormUser from "../../../../components/forms/CadastroForm/CadastroFormUser";
import { motion } from "framer-motion";

export default function Form() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-black text-white overflow-hidden">

      {/* LADO ESQUERDO — FOTO / HERO */}
      {!showForm && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center p-6"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/img/fundo/bg-login.png')",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 40% 20%, rgba(249, 71, 102, 0.45), transparent 70%),
                linear-gradient(180deg, rgba(20,0,0,0.70), rgba(10,0,0,0.90))
              `,
            }}
          />

          <div className="relative z-10 px-6 text-center lg:text-left max-w-lg">
            <h1 className="text-4xl font-extrabold leading-tight drop-shadow-lg">
              Gire a <span className="text-[#f94766]">Roleta</span> e Ganhe Prêmios!
            </h1>
            <p className="text-gray-200 mt-4 text-lg">
              Cada giro pode garantir um brinde exclusivo.
            </p>
          </div>
        </motion.div>
      )}

      {/* LADO DIREITO — CTAs ou FORM */}
      {showForm ? (
        // ✅ mantém o form centralizado no mesmo layout
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
       
        >
          <CadastroFormUser />
        </motion.div>
      ) : (
        // ✅ tela de apresentação
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center mt-10 px-10 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6 tracking-wide">
            Comece agora
          </h2>

          <p className="text-gray-300 max-w-sm mb-4">
            Em menos de 2 minutos você cria sua conta e já pode começar a girar a roleta.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f94766] to-[#bf1738] hover:opacity-90 transition-all duration-200 shadow-lg"
          >
            Criar minha conta
          </button>

          <div className="mt-10 w-full max-w-md rounded-xl overflow-hidden shadow-lg border border-white/10">
            <video
              src="/videos/roleta.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-xl"
            />
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Já tem conta?{" "}
            <a href="/pages/user/signIn" className="text-[#f94766] hover:underline">
              Entrar
            </a>
          </p>
        </motion.div>
      )}
    </div>
  );
}
