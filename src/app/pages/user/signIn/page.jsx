"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Header from "../../../../components/header/Header";

export default function signIn() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        handleSubmit,
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const response = true;

        if (response === true) {
            toast.success("Cadastro realizado com sucesso!");
            reset();
            router.push(`/pages/user/dashboard`);
        }
    };

  
    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });

    

    return (
        <div className="relative h-screen w-screen overflow-hidden font-[Bangers]">
            <Header />
            <motion.div
                {...fadeIn(0)}
                className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
              style={{
        background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 100%)"
      }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 w-full max-w-md text-white"
                >
                    <div className="mt-12 mb-10 text-[40px] text-center">Acesse sua conta</div>

                    <div>
                        <label>Email</label>
                        <input
                            {...register("email", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                            placeholder="exemplo@email.com"
                            autoComplete="off"
                            type="email"
                        />
                        {errors.email && (
                            <p className="text-[#ef4444] text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label>Senha</label>
                        <input
                            {...register("senha", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="off"
                        />
                        {errors.senha && (
                            <p className="text-[#ef4444] text-sm">{errors.senha.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>

                        <p className="text-sm text-gray-100">
                            Não tem conta?{" "}
                            <a
                                href="/pages/user/signUp"
                                className="text-[#973bfe] font-semibold hover:underline"
                            >
                                Registre-se
                            </a>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
