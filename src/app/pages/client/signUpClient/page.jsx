"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SuccessAnimationAurora from "../../../../components/feedback/SuccessAnimation";
import { api } from "../../../../utils/api";
import { setUserToken } from "../../../../utils/auth";
import Step1Empresa from "../../../../components/forms/CadastroFormClient/stepsClient/Step1Empresa";
import Step2ResponsavelAcesso from "../../../../components/forms/CadastroFormClient/stepsClient/Step2ResponsavelAcesso";
import Step3Endereco from "../../../../components/forms/CadastroFormClient/stepsClient/Step3Endereco";
import ProgressDots from "../../../../components/forms/CadastroForm/ProgressDots"; // você já tem esse

// helpers compartilhados
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});
const onlyDigits = (s = "") => String(s).replace(/\D/g, "");

// payload: exatamente como seu /clients espera
function buildPayload(form) {
  const now = new Date();
  const dateOnly = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return {
    corporate_name: form.corporate_name?.trim(),
    responsable_name: form.responsable_name?.trim(),
    doc_responsable: onlyDigits(form.doc_responsable),
    cnpj: form.cnpj, // se o backend exigir só dígitos, troque por onlyDigits(form.cnpj)
    number_cellphone: onlyDigits(form.number_cellphone),
    email: form.email?.trim(),
    password: form.password,
    cep: onlyDigits(form.cep),
    street: form.street?.trim(),
    number: String(form.number ?? "").trim(),
    neighborhood: form.neighborhood?.trim(),
    city: form.city?.trim(),
    state: form.state?.trim().toUpperCase(),
    country: (form.country || "Brasil").trim(),
    date_created: dateOnly,
  };
}

export default function SignUpEmpresa() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      corporate_name: "",
      fantasy_name: "",
      cnpj: "",
      responsable_name: "",
      doc_responsable: "",
      number_cellphone: "",
      email: "",
      password: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "Brasil",
      aceita_termos: false,
    },
  });

  // valida e avança
  const nextStep = async () => {
    const { trigger } = methods;

    if (step === 1) {
      const ok = await trigger(["corporate_name", "cnpj", "fantasy_name"]);
      if (!ok) return;
      setStep(2);
    } else if (step === 2) {
      const ok = await trigger([
        "responsable_name",
        "doc_responsable",
        "number_cellphone",
        "email",
        "password",
      ]);
      if (!ok) return;
      setStep(3);
    }
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submitHandler = methods.handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      const payload = buildPayload(data);
      const res = await api.createClient(payload); // ajuste se seu util tiver outro nome

      const token =
        res?.access_token || res?.token || res?.data?.access_token || null;
      if (token) setUserToken(token, 60 * 60);
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      alert("Falha ao cadastrar a empresa. Tente novamente.");
    }
  });

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden">
      {/* voltar */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => (step === 1 ? router.back() : prevStep())}
          className="text-[#973bfe] hover:text-purple-900 transition"
          aria-label="Voltar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <motion.div
        {...fadeIn(0)}
        className="min-h-screen flex items-center justify-center px-4 font-[Roboto]"
        style={{
          // mesmo background do seu CadastroFormUser
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.25), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%), radial-gradient(800px 500px at 50% 85%, rgba(168,85,247,0.18), transparent 60%)",
        }}
      >
       {showSuccess && (
   <SuccessAnimationAurora
     show
     message="Empresa cadastrada com sucesso!"
     subtext="Redirecionando para o dashboard…"
     autoCloseMs={1800}  // fecha sozinho
     onClose={() => {
       methods.reset();
      router.push("/pages/client/dashboard");
     }}
   />
 )}

        {!showSuccess && (
          <FormProvider {...methods}>
            <form onSubmit={submitHandler} className="space-y-4 w-full max-w-md text-white">
              {step === 1 && <Step1Empresa step={step} setStep={setStep} onNext={nextStep} />}
              {step === 2 && <Step2ResponsavelAcesso step={step} setStep={setStep} onNext={nextStep} onBack={prevStep} />}
              {step === 3 && (
                <Step3Endereco
                  step={step}
                  setStep={setStep}
                  onBack={prevStep}
                  isSubmitting={isSubmitting}
                />
              )}

              <div className="mt-4">
                <ProgressDots step={step} total={3} />
              </div>
            </form>
          </FormProvider>
        )}
      </motion.div>
    </div>
  );
}
