"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Header from "@/app/components/header/HeaderWithOutButtons";

export default function signInClient() {
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
            router.push(`/pages/client/dashboard`);
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
                style={{ background: "#1f1f1f" }}
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
                            className="px-4 py-2 bg-[#facc15] text-black rounded hover:bg-[#e0b80f] transition font-semibold"
                        >
                            {isSubmitting ? "Entrando..." : "Entrar"}
                        </button>

                        <p className="text-sm text-gray-600">
                            Não tem conta?{" "}
                            <a
                                href="/pages/signUp"
                                className="text-yellow-600 font-semibold hover:underline"
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
