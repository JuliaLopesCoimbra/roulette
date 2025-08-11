"use client";
import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import hobbiesList from "../../../../components/hobbiesInput/HobbiesList";
import SuccessAnimation from "../../../../components/successAnimation/SuccessAnimation";
export default function Form() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [redesSelecionadas, setRedesSelecionadas] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const {
        handleSubmit,
        register,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
        trigger,
    } = useForm(({
        mode: "onBlur", // ou "onTouched"
    }));
    const onSubmit = async (data) => {
        console.log("Dados enviados:", data);
        setIsSubmitting(true);

        const response = true;

        if (response === true) {
            setShowSuccess(true); // 👈 Mostra a animação

            setTimeout(() => {
                // toast.success("Cadastro realizado com sucesso!");
                reset();
                router.push("/pages/user/dashboard");
            }, 2000);
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
    const formattedHobbies = hobbiesList.map((hobby) => ({
        label: hobby,
        value: hobby,
    }));

    return (
        <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden font-[Bangers]">
            <motion.div
                {...fadeIn(0)}
                className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
                 style={{
        background: "radial-gradient(circle at center, #5a5a5a 0%, #0b1f3a 100%)"
      }}
            >
                {showSuccess && <SuccessAnimation />}
                {!showSuccess && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 w-full max-w-md text-white"
                    >
                        {step === 1 && (
                            <>
                                <div className="absolute top-10   z-10 ">
                                    <button
                                        onClick={() => router.back()}
                                        className="text-[#973bfe] hover:text-purple-900"
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
                                {/* <div className="mt-12 mb-10 text-[4vh]">Faça o seu cadastro</div> */}
                                <div>
                                    <label>Nome Completo</label>
                                    <input
                                        {...register("nome", {
                                            required: "Campo obrigatório",
                                            validate: (value) =>
                                                /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+)+$/.test(value.trim()) ||
                                                "Digite seu nome completo (nome e sobrenome)",
                                        })}
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-transparent focus:border-[#973bfe] focus:outline-none"
                                    />
                                    {errors.nascimento && (
                                        <p className="text-[#ef4444] text-sm">{errors.nascimento.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-center mt-4 gap-2">
                                    <div className={`w-1 h-1 rounded-full ${step === 1 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 2 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 3 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 4 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                </div>

                                <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                                    {step < 4 && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const valid = await trigger(["nome", "cpf", "celular", "nascimento"]);
                                                if (valid) setStep(2);
                                            }}
                                            className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                                        >
                                            Avançar
                                        </button>

                                    )}
                                    <p className="text-sm text-gray-200">
                                        Já tem login?{" "}
                                        <a
                                            href="/pages/client/signIn"
                                            className="text-purple-400 font-semibold hover:underline"
                                        >
                                            Acesse sua conta
                                        </a>
                                    </p>
                                </div>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="absolute top-10 z-10 ">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-[#973bfe] hover:text-purple-900"
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
                                <div className="mt-12">
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                <div className="flex justify-center mt-4 gap-2">
                                    <div className={`w-1 h-1 rounded-full ${step === 1 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 2 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 3 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 4 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                </div>
                                <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                                    {step < 4 && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const valid = await trigger(["cep", "rua", "numero", "bairro", "cidade", "estado"]);
                                                if (valid) setStep(3);
                                            }}
                                            className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                                        >
                                            Avançar
                                        </button>

                                    )}
                                </div>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="absolute top-10  z-10 ">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="text-[#973bfe] hover:text-purple-900"
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
                                <div>
                                    <label>Email</label>
                                    <input
                                        {...register("email", { required: "Campo obrigatório" })}
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
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
                                        className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
                                        placeholder="Repita sua senha"
                                        value={"10203011J@"}
                                    />
                                    {errors.confirmarSenha && (
                                        <p className="text-[#ef4444] text-sm">{errors.confirmarSenha.message}</p>
                                    )}

                                    <div className="flex justify-center mt-4 gap-2">
                                        <div className={`w-1 h-1 rounded-full ${step === 1 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                        <div className={`w-1 h-1 rounded-full ${step === 2 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                        <div className={`w-1 h-1 rounded-full ${step === 3 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                        <div className={`w-1 h-1 rounded-full ${step === 4 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                                    {step < 4 && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const valid = await trigger(["email", "senha", "confirmarSenha"]);
                                                if (valid) setStep(4);
                                            }}
                                            className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                                        >
                                            Avançar
                                        </button>

                                    )}
                                </div>
                            </>
                        )}
                        {step == 4 && (
                            <>
                                <div className="absolute top-10 z-10 ">
                                    <button
                                        onClick={() => setStep(3)}
                                        className="text-[#973bfe] hover:text-purple-900"
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
                                <div className="mt-10">
                                    <label className="block mb-1">Quais redes sociais você usa?</label>
                                    <div className="flex flex-wrap gap-3">
                                        {["Instagram", "TikTok", "LinkedIn", "Facebook", "X"].map((rede) => (
                                            <label key={rede} className="flex items-center space-x-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => toggleRede(rede)}
                                                    checked={redesSelecionadas.includes(rede)}
                                                    className="accent-purple-700"
                                                />
                                                <span>{rede}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block mb-1 text-sm font-medium text-white">Profissão</label>
                                    <Controller
                                        name="profissao"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: "Campo obrigatório" }}
                                        render={({ field }) => (
                                            <>
                                                <CreatableSelect
                                                    {...field}
                                                    isClearable
                                                    options={[
                                                        { value: "Designer", label: "Designer" },
                                                        { value: "Estudante", label: "Estudante" },
                                                        { value: "Vendedor", label: "Vendedor" },
                                                        { value: "Programador", label: "Programador" },
                                                    ]}
                                                    placeholder="Digite ou escolha sua profissão"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                />
                                                {errors.profissao && (
                                                    <p className="text-[#ef4444] text-sm mt-1">{errors.profissao.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label className="block mb-1 text-sm font-medium text-white">Hobbies</label>
                                    <Controller
                                        name="hobbies"
                                        control={control}
                                        defaultValue={[]}
                                        rules={{
                                            validate: (value) => {
                                                if (!value || value.length === 0) {
                                                    return "Selecione pelo menos 1 hobby";
                                                }
                                                if (value.length > 4) {
                                                    return "Máximo de 4 hobbies permitidos";
                                                }
                                                return true;
                                            },
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti
                                                    options={formattedHobbies}
                                                    onChange={(selected) => {
                                                        if (selected.length <= 4) field.onChange(selected);
                                                    }}
                                                    placeholder="Digite ou escolha até 4 hobbies"
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                />
                                                {errors.hobbies && (
                                                    <p className="text-[#ef4444] text-sm mt-1">
                                                        {errors.hobbies.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block mb-1 text-sm font-medium text-white">Marcas preferidas</label>
                                    <Controller
                                        name="marcasPreferidas"
                                        control={control}
                                        defaultValue={[]}
                                        rules={{
                                            validate: (value) => {
                                                if (!value || value.length === 0) {
                                                    return "Selecione pelo menos 1 marca";
                                                }
                                                if (value.length > 5) {
                                                    return "Máximo de 5 marcas permitidas";
                                                }
                                                return true;
                                            },
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <CreatableSelect
                                                    {...field}
                                                    isMulti
                                                    options={[
                                                        { value: "Nike", label: "Nike" },
                                                        { value: "Apple", label: "Apple" },
                                                        { value: "Adidas", label: "Adidas" },
                                                        { value: "Samsung", label: "Samsung" },
                                                    ]}
                                                    onChange={(selected) => {
                                                        if (selected.length <= 5) field.onChange(selected);
                                                    }}
                                                    placeholder="Ex: Nike, Apple, Adidas..."
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                />
                                                {errors.marcasPreferidas && (
                                                    <p className="text-[#ef4444] text-sm mt-1">
                                                        {errors.marcasPreferidas.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block mb-1 text-sm font-medium text-white">Como conheceu a plataforma?</label>
                                    <Controller
                                        name="origem"
                                        control={control}
                                        defaultValue={null}
                                        rules={{ required: "Campo obrigatório" }}
                                        render={({ field }) => (
                                            <>
                                                <CreatableSelect
                                                    {...field}
                                                    isClearable
                                                    options={[
                                                        { value: "Instagram", label: "Instagram" },
                                                        { value: "Indicação", label: "Indicação" },
                                                        { value: "Anúncio", label: "Anúncio" },
                                                        { value: "Google", label: "Google" },
                                                    ]}
                                                    placeholder="Instagram, indicação, anúncio..."
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    styles={selectStyles}
                                                />
                                                {errors.origem && (
                                                    <p className="text-[#ef4444] text-sm mt-1">
                                                        {errors.origem.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
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
                                        <div className="w-5 h-5 bg-[#973bfe] rounded-full peer-checked:ring-2 peer-checked:ring-[#973bfe] peer-checked:border-4 peer-checked:border-black transition-all duration-200"></div>
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
                                    <div className={`w-1 h-1 rounded-full ${step === 1 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 2 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 3 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${step === 4 ? 'bg-[#973bfe]' : 'bg-gray-600'}`}></div>
                                </div>
                                <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                                    {step == 4 && (
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                const valid = await trigger(["profissao", "hobbies", "origem", "aceita_termos"]);
                                                if (valid) handleSubmit(onSubmit)(); // dispara o submit manualmente
                                            }}
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
                                        >
                                            {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
                                        </button>

                                    )}
                                </div>
                            </>
                        )}
                    </form>
                )}


            </motion.div>
            {showSuccess && <SuccessAnimation />}

        </div>

    );
}
const selectStyles = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "#2c2c2e",
        borderColor: "#374151",
        color: "white", // <- aplica ao texto principal
        minHeight: "38px",
        boxShadow: state.isFocused ? "0 0 0 1px #4b5563" : "none",
        "&:hover": {
            borderColor: "#4b5563",
        },
    }),
    input: (base) => ({
        ...base,
        color: "white", // <- texto digitado
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#2c2c2e",
        color: "white",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "#4b5563" : "#2c2c2e",
        color: "white",
        cursor: "pointer",
    }),
    singleValue: (base) => ({
        ...base,
        color: "white", // <- valor selecionado
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: "#374151",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "white",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#9ca3af",
    }),
};
