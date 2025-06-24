"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";


export default function Form() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [redesSelecionadas, setRedesSelecionadas] = useState([]);


    const {
        handleSubmit,
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm(({
        mode: "onBlur", // ou "onTouched"
    }));

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const response = true;

        if (response === true) {
            toast.success("Cadastro realizado com sucesso!");
            reset();
            router.push(`/pages/video`);
        }
    };

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.charAt(10));
    }

    const formatCelular = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });
const toggleRede = (rede) => {
  setRedesSelecionadas((prev) =>
    prev.includes(rede)
      ? prev.filter((item) => item !== rede)
      : [...prev, rede]
  );
};



    return (
        <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden font-[Bangers]">

            <motion.div
                {...fadeIn(0)}
                className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
                style={{ background: "#1f1f1f" }}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 w-full max-w-md text-white"
                >
                    {step === 1 && (

                        <>
                            <div className="absolute top-10 left-10 p-4 z-10 ">
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
                            <div className="mt-12 mb-10 text-[4vh]">Faça o seu cadastro</div>

                            <div>
                                <label>Nome Completo</label>
                                <input
                                    {...register("nome", {
                                        required: "Campo obrigatório",
                                        validate: (value) =>
                                            /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+)+$/.test(value.trim()) ||
                                            "Digite seu nome completo (nome e sobrenome)",
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="Digite seu nome"
                                    autoComplete="off"
                                    value={'Julia Cristina Lopes'}
                                />

                                {errors.nome && (
                                    <p className="text-[#ef4444] text-sm">{errors.nome.message}</p>
                                )}
                            </div>
                            <div>
                                <label>CPF</label>
                                <input
                                    {...register("cpf", {
                                        required: "Campo obrigatório",
                                        validate: (value) =>
                                            validarCPF(value) || "CPF inválido",
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="000.000.000-00"
                                    onChange={(e) => setValue("cpf", formatCPF(e.target.value))}
                                    value="42117733808"
                                    autoComplete="off"
                                />
                                {errors.cpf && (
                                    <p className="text-[#ef4444] text-sm">{errors.cpf.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Celular</label>
                                <input
                                    {...register("celular", { required: "Campo obrigatório" })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="(11) 9 8765-4321"
                                    onChange={(e) => setValue("celular", formatCelular(e.target.value))}
                                    value="(11) 9 8765-4321"
                                    autoComplete="off"
                                />
                                {errors.celular && (
                                    <p className="text-[#ef4444] text-sm">{errors.celular.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    {...register("email", { required: "Campo obrigatório" })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="exemplo@email.com"
                                    autoComplete="off"
                                    type="email"
                                    value="juliacristinalopes@gmail.com"
                                />
                                {errors.email && (
                                    <p className="text-[#ef4444] text-sm">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Senha</label>
                                <input
                                    type="password"
                                    {...register("senha", {
                                        required: "Campo obrigatório",
                                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                                        validate: (value) =>
                                            /^(?=.*[A-Z])(?=.*\W)/.test(value) ||
                                            "A senha deve conter ao menos 1 letra maiúscula e 1 caractere especial",
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="Digite sua senha"
                                    value={"10203011J@"}
                                />
                                {errors.senha && (
                                    <p className="text-[#ef4444] text-sm">{errors.senha.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Confirmar Senha</label>
                                <input
                                    type="password"
                                    {...register("confirmarSenha", {
                                        required: "Campo obrigatório",
                                        validate: (value) =>
                                            value === watch("senha") || "As senhas não coincidem",
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="Repita sua senha"
                                    value={"10203011J@"}
                                />
                                {errors.confirmarSenha && (
                                    <p className="text-[#ef4444] text-sm">{errors.confirmarSenha.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Data de Nascimento</label>
                                <input
                                    type="date"
                                    {...register("nascimento", {
                                        required: "Campo obrigatório",
                                        validate: (value) => {
                                            const data = new Date(value);
                                            const hoje = new Date();
                                            const idade = hoje.getFullYear() - data.getFullYear();
                                            return idade >= 18 || "Você precisa ter pelo menos 18 anos";
                                        },
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-transparent focus:border-[#facc15] focus:outline-none"
                                />
                                {errors.nascimento && (
                                    <p className="text-[#ef4444] text-sm">{errors.nascimento.message}</p>
                                )}
                            </div>
                            <div>
                                <label>CEP</label>
                                <input
                                    {...register("cep", {
                                        required: "Campo obrigatório",
                                        onChange: async (e) => {
                                            const cep = e.target.value.replace(/\D/g, "");
                                            setValue("cep", cep);
                                            if (cep.length === 8) {
                                                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                                                const data = await res.json();
                                                if (!data.erro) {
                                                    setValue("rua", data.logradouro);
                                                    setValue("bairro", data.bairro);
                                                    setValue("cidade", data.localidade);
                                                    setValue("estado", data.uf);
                                                }
                                            }
                                        },
                                    })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="Digite seu CEP"

                                />
                                {errors.cep && (
                                    <p className="text-[#ef4444] text-sm">{errors.cep.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Rua</label>
                                <input
                                    {...register("rua")}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-gray-700"
                                    placeholder="Rua"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Número</label>
                                <input
                                    {...register("numero", { required: "Campo obrigatório" })}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#facc15] focus:outline-none"
                                    placeholder="Número da residência"
                                />
                                {errors.numero && (
                                    <p className="text-[#ef4444] text-sm">{errors.numero.message}</p>
                                )}
                            </div>
                            <div>
                                <label>Bairro</label>
                                <input
                                    {...register("bairro")}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
                                    placeholder="Bairro"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Cidade</label>
                                <input
                                    {...register("cidade")}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
                                    placeholder="Cidade"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label>Estado</label>
                                <input
                                    {...register("estado")}
                                    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
                                    placeholder="Estado"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("aceita_termos", {
                                            required: "Você precisa aceitar os termos de uso de dados.",
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-5 h-5 bg-[#facc15] rounded-full peer-checked:ring-2 peer-checked:ring-[#eab308] peer-checked:border-4 peer-checked:border-black transition-all duration-200"></div>
                                </label>

                                <label className="text-sm">
                                    Eu aceito os{" "}
                                    <a href="#" className="underline">
                                        termos de uso de dados
                                    </a>.
                                </label>
                            </div>
                            {errors.aceita_termos && (
                                <p className="text-[#ef4444] text-sm">{errors.aceita_termos.message}</p>
                            )}
                            <div className="flex justify-center mt-4 gap-2">
                                <div className={`w-1 h-1 rounded-full ${step === 1 ? 'bg-[#facc15]' : 'bg-gray-600'}`}></div>
                                <div className={`w-1 h-1 rounded-full ${step === 2 ? 'bg-[#facc15]' : 'bg-gray-600'}`}></div>
                            </div>

                            <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                                {step === 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="px-4 py-2 bg-[#facc15] text-black rounded hover:bg-[#e0b80f] transition font-semibold"
                                    >
                                        Avançar
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-[#facc15] text-black rounded hover:bg-[#e0b80f] transition font-semibold"
                                    >
                                        {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
                                    </button>
                                )}


                                <p className="text-sm text-gray-600">
                                    Já tem login?{" "}
                                    <a
                                        href="/pages/client/signIn"
                                        className="text-yellow-600 font-semibold hover:underline"
                                    >
                                        Acesse sua conta
                                    </a>
                                </p>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div className="absolute top-10 left-10 p-4 z-10 ">
                                <button
                                    onClick={() => setStep(1)}
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
                            {/* ETAPA 2 — Novos campos que você quiser */}
                          {/* Redes sociais */}
<div>
  <label className="block mb-1">Quais redes sociais você usa?</label>
  <div className="flex flex-wrap gap-3">
    {["Instagram", "TikTok", "LinkedIn", "Facebook", "X"].map((rede) => (
      <label key={rede} className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          onChange={() => toggleRede(rede)}
          checked={redesSelecionadas.includes(rede)}
          className="accent-yellow-400"
        />
        <span>{rede}</span>
      </label>
    ))}
  </div>
</div>

{/* Campos dinâmicos para usuários */}
{redesSelecionadas.map((rede) => (
  <div key={rede} className="mt-3">
    <label className="block mb-1">Usuário do {rede}</label>
    <input
      {...register(`usuario_${rede.toLowerCase()}`, {
        required: `Informe o usuário do ${rede}`,
      })}
      className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
      placeholder={`@seu${rede.toLowerCase()}`}
    />
    {errors[`usuario_${rede.toLowerCase()}`] && (
      <p className="text-[#ef4444] text-sm">
        {errors[`usuario_${rede.toLowerCase()}`].message}
      </p>
    )}
  </div>
))}
{/* Profissão */}
<div>
  <label>Profissão</label>
  <input
    {...register("profissao", { required: "Campo obrigatório" })}
    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
    placeholder="Ex: Designer, Estudante, Vendedor"
  />
  {errors.profissao && (
    <p className="text-[#ef4444] text-sm">{errors.profissao.message}</p>
  )}
</div>

{/* Hobbies (múltipla escolha) */}
<div>
  <label>Hobbies</label>
  <div className="flex flex-wrap gap-2 mt-1">
    {["Futebol", "Xadrez", "Cantar", "Musculação", "Leitura", "Cozinhar"].map((hobby) => (
      <label key={hobby} className="flex items-center space-x-1 text-sm">
        <input
          type="checkbox"
          value={hobby}
          {...register("hobbies")}
          className="accent-yellow-400"
        />
        <span>{hobby}</span>
      </label>
    ))}
  </div>
</div>

{/* Campo adicional para hobby personalizado */}
<div className="mt-2">
  <input
    {...register("hobbyOutro")}
    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
    placeholder="Outro hobby?"
  />
</div>

{/* Marcas preferidas */}
<div>
  <label>Marcas preferidas</label>
  <input
    {...register("marcasPreferidas")}
    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
    placeholder="Ex: Nike, Apple, Adidas, etc"
  />
</div>

{/* (Opcional) Objetivo ou origem */}
<div>
  <label>Como conheceu a plataforma?</label>
  <input
    {...register("origem")}
    className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-gray-700"
    placeholder="Instagram, indicação, anúncio, etc."
  />
</div>

                        </>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
