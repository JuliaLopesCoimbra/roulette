"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import SuccessAnimationAurora from "../../../components/feedback/SuccessAnimation";
import Step1DadosPessoais from "./stepsUser/Step1DadosPessoais";
import Step2Endereco from "./stepsUser/Step2Endereco";
import Step3Acesso from "./stepsUser/Step3Acesso";
import Step4Preferencias from "./stepsUser/Step4Preferencias";
import { api } from "../../../utils/api";
import { setUserToken } from "../../../utils/auth";
const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});




export default function CadastroFormUser() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [redesSelecionadas, setRedesSelecionadas] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(true);

    const methods = useForm({ mode: "onBlur" });

    const submitHandler = methods.handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
            const onlyDigits = (s = "") => String(s).replace(/\D/g, "");

            // gera "YYYY-MM-DD" (sem hora/sem Z)
            const now = new Date();
            const dateOnly = [
                now.getFullYear(),
                String(now.getMonth() + 1).padStart(2, "0"),
                String(now.getDate()).padStart(2, "0"),
            ].join("-");
            const payload = {
                // pessoais
                name: data.nome?.trim(),
                email: data.email?.trim(),
                password: data.senha,                   // já validada
                gender: data.gender,                    // Feminino / Masculino
                date_birth: data.nascimento,            // "YYYY-MM-DD"

                // documentos/contato
                document: onlyDigits(data.cpf),         // CPF só números
                number_cellphone: onlyDigits(data.celular),

                // endereço
                cep: onlyDigits(data.cep),
                street: data.rua,
                number: data.numero,
                neighborhood: data.bairro,
                city: data.cidade,
                state: data.estado,
                country: "Brasil",

                // relacionamentos (IDs)
                profession_ID: data.profissao?.value ?? null,
                met_ID: Number(data.origem?.value),
                social_media_ids: Array.isArray(data.social_media_ids) ? data.social_media_ids : [],
                hobby_ids: Array.isArray(data.hobbies) ? data.hobbies.map((h) => h.value) : [],
                brand_ids: Array.isArray(data.marcas) ? data.marcas.map((b) => b.value) : [],

                // opcional
                date_create: dateOnly,
            };
            
            const res = await api.signup(payload);
            const token =
                res?.access_token || res?.token || res?.data?.access_token;

            if (!token) {
                throw new Error("Token não retornado pelo cadastro.");
            }

            // salva cookie user_token
            setUserToken(token, 60 * 60); // 1h (ajuste se quiser)

            setShowSuccess(true);
            setTimeout(() => {
                methods.reset();
                // se quiser manter as seleções de rede locais:
                setRedesSelecionadas([]);
                router.push("/pages/user/home");
            }, 2000);
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            // aqui você pode usar o seu toast padrão
            // toast.error("Falha ao criar usuário");
            alert("Falha ao criar usuário");
        }
    });


    return (
        <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden ">
            <motion.div
                {...fadeIn(0)}
                className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
                style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
        }}
            >
              

                {!showSuccess && (
                    <FormProvider {...methods}>
                        <form onSubmit={submitHandler} className="space-y-4 w-full max-w-md text-white">
                            {step === 1 && (
                                <Step1DadosPessoais step={step} setStep={setStep} router={router} />
                            )}
                            {step === 2 && (
                                <Step2Endereco step={step} setStep={setStep} />
                            )}
                            {step === 3 && (
                                <Step3Acesso step={step} setStep={setStep} />
                            )}
                            {step === 4 && (
                                <Step4Preferencias
                                    step={step}
                                    setStep={setStep}
                                    redesSelecionadas={redesSelecionadas}
                                    setRedesSelecionadas={setRedesSelecionadas}
                                    isSubmitting={isSubmitting}
                                    onSubmit={submitHandler} // dispara o submit do <form>
                                />
                            )}
                        </form>
                    </FormProvider>
                )}
            </motion.div>

           <SuccessAnimationAurora
  show={showSuccess}
  message="Cadastro realizado com sucesso!"
  subtext="Redirecionando para sua área…"
  autoCloseMs={2000}            // ou null pra não fechar sozinho
  onClose={() => router.push("/pages/user/home")}
/>

        </div>
    );
}
