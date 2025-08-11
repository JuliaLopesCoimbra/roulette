"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Header from "@/app/components/header/HeaderWithOutButtons";
import SuccessAnimation from "@/app/components/successAnimation/SuccessAnimation";
export default function SignUpEmpresa() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const formatCNPJ = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    };

    const validarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj.length !== 14) return false;
        if (/^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado === parseInt(digitos.charAt(1));
    };

    const onSubmit = async (data) => {
        console.log("Dados enviados:", data);
        setIsSubmitting(true);
        const response = true;
        if (response === true) {
            setShowSuccess(true); // 👈 Mostra a animação

            setTimeout(() => {
                // toast.success("Cadastro realizado com sucesso!");
                reset();
                router.push(`/pages/client/dashboard`);
            }, 2000);
        }
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });

    return (
        <div className="min-h-screen w-full overflow-x-hidden font-[Bangers] ">
            <div className="absolute top-10 left-10 p-4 z-10">
                <button
                    onClick={() => router.back()}
                    className="text-yellow-500 hover:text-yellow-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            <motion.div
                {...fadeIn(0)}
                className="min-h-screen flex items-center justify-center px-4 font-[Roboto] p-6"
                style={{ background: "#1f1f1f" }}
            >
                 {showSuccess && <SuccessAnimation />}
                  {!showSuccess && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md text-white">
                    <div className="mt-10 mb-10 text-[3.7vh]">Comece fornecendo os dados necessários</div>

                    <div>
                        <label>Razão Social</label>
                        <input {...register("razao", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#facc15] focus:outline-none"
                            placeholder="Nome da razão social"
                            value={"PIC BRAND"} />
                        {errors.razao && <p className="text-[#ef4444] text-sm">{errors.razao.message}</p>}
                    </div>

                    <div>
                        <label>Nome Fantasia</label>
                        <input {...register("fantasia", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf]"
                            placeholder="Nome fantasia da empresa"
                            value={"Pic Brand"} />
                        {errors.fantasia && <p className="text-[#ef4444] text-sm">{errors.fantasia.message}</p>}
                    </div>

                    <div>
                        <label>CNPJ</label>
                        <input {...register("cnpj", {
                            required: "Campo obrigatório",
                            validate: (value) => validarCNPJ(value) || "CNPJ inválido",
                        })}
                            onChange={(e) => setValue("cnpj", formatCNPJ(e.target.value))}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf]"
                            placeholder="00.000.000/0001-00"
                            value={"61.365.403/0001-29"}
                            autoComplete="off" />
                        {errors.cnpj && <p className="text-[#ef4444] text-sm">{errors.cnpj.message}</p>}
                    </div>

                    <div>
                        <label>Telefone Comercial</label>
                        <input {...register("telefone", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf]"
                            placeholder="(11) 2345-6789"
                            value={"(11) 2345-6789"} />
                        {errors.telefone && <p className="text-[#ef4444] text-sm">{errors.telefone.message}</p>}
                    </div>

                    <div>
                        <label>Email Corporativo</label>
                        <input {...register("email", { required: "Campo obrigatório" })}
                            type="email"
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf]"
                            placeholder="empresa@email.com"
                            value={"contato@picbrand.com"} />
                        {errors.email && <p className="text-[#ef4444] text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label>Responsável pela empresa</label>
                        <input {...register("responsavel", { required: "Campo obrigatório" })}
                            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf]"
                            placeholder="Nome completo do responsável"
                            value={"Valdemir Junior"} />
                        {errors.responsavel && <p className="text-[#ef4444] text-sm">{errors.responsavel.message}</p>}
                    </div>

                    <div className="flex flex-col items-center justify-center mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#facc15] text-black rounded hover:bg-[#e0b80f] transition font-semibold"
                        >
                            {isSubmitting ? "Enviando..." : "Cadastrar Empresa"}
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                            Já tem login?{" "}
                            <a
                                href="/pages/client/signInClient"
                                className="text-yellow-600 font-semibold hover:underline"
                            >
                                Acesse sua conta
                            </a>
                        </p>
                    </div>
                </form>
                  )}
            </motion.div>
        </div>
    );
}
