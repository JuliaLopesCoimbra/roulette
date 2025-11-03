"use client";
import { useFormContext } from "react-hook-form";
import ProgressDots from "../ProgressDots";
import { validarEmail } from "../../../../utils/validators";
import { useState } from "react";
import { URL_BASE } from "../../../../utils/api";
const strongPwd = (v = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:]).{12,}$/.test(v);

export default function Step3Credenciais({ step, setStep }) {
  const { register, watch, trigger, getValues, setError, clearErrors, formState: { errors } } =
    useFormContext();

  const senha = watch("senha");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 async function verifyEmailServer(email) {
  if (!email) return { is_valid: false, exists: false, status: "invalid" };

  const res = await fetch(
    `${URL_BASE}/users-verify/verify-email?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );

  if (!res.ok) throw new Error("Falha ao verificar e-mail");

  return await res.json();
}


  const handleNext = async () => {
    // 1) validações locais
    const ok = await trigger(["email", "senha", "confirmarSenha"]);
    if (!ok) return;

    // 2) validação remota
    try {
      setCheckingEmail(true);
      const email = getValues("email");
      const data = await verifyEmailServer(email);

      if (data?.is_valid && !data?.exists) {
        clearErrors("email");
        setStep(4);
      } else {
        setError("email", {
          type: "server",
          message: data?.exists ? "Este e-mail já está em uso." : "E-mail inválido.",
        });
      }
    } catch (e) {
      setError("email", {
        type: "server",
        message: "Não foi possível validar o e-mail agora. Tente novamente.",
      });
    } finally {
      setCheckingEmail(false);
    }
  };

  return (
    <>
      <div className="absolute top-10 z-10">
        <button onClick={() => setStep(2)} className="text-[#fb4667] hover:text-[#ff2c53]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div>
        <label>Email</label>
        <input
          {...register("email", {
            required: "Campo obrigatório",
            validate: (v) => validarEmail(v) || "Email inválido",
          })}
          className="w-full p-2 rounded-md bg-[#ffffff] text-black placeholder:text-[#bfbfbf] border border-transparent focus:border-[#fb4667] focus:outline-none"
          placeholder="exemplo@email.com"
          type="email"
          autoComplete="email"
        />
        {errors.email && <p className="text-[#ef4444] text-sm">{errors.email.message}</p>}
      </div>

      {/* Senha + olho */}
      <div className="relative">
        <label>Senha</label>
        <input
          type={showPassword ? "text" : "password"}
          {...register("senha", {
            required: "Campo obrigatório",
            validate: {
              minLen: (v) => (v?.length ?? 0) >= 12 || "Mínimo 12 caracteres",
              strong:
                (v) =>
                  strongPwd(v) ||
                  "Senha fraca: precisa de 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
            },
          })}
          className="w-full p-2 pr-10 rounded-md bg-[#ffffff] text-black border border-transparent focus:border-[#fb4667] focus:outline-none"
          placeholder="Crie uma senha forte"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 top-[36px] text-gray-300 hover:text-white"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.132-3.368M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18" />
            </svg>
          )}
        </button>
        {errors.senha && <p className="text-[#ef4444] text-sm">{errors.senha.message}</p>}
      </div>

      {/* Confirmar + olho */}
      <div className="relative">
        <label>Confirmar Senha</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmarSenha", {
            required: "Campo obrigatório",
            validate: (v) => v === senha || "As senhas não coincidem",
          })}
          className="w-full p-2 pr-10 rounded-md bg-[#ffffff] text-black border border-transparent focus:border-[#fb4667] focus:outline-none"
          placeholder="Repita sua senha"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((s) => !s)}
          className="absolute right-3 top-[36px] text-gray-300 hover:text-white"
          tabIndex={-1}
          aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}
        >
          {showConfirmPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.132-3.368M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18" />
            </svg>
          )}
        </button>
        {errors.confirmarSenha && (
          <p className="text-[#ef4444] text-sm">{errors.confirmarSenha.message}</p>
        )}
      </div>

      <ProgressDots step={step} />

      <div className="flex flex-col items-center justify-center mt-8 space-y-2">
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-[#fb4667] text-white rounded hover:bg-[#fd224a] transition font-semibold disabled:opacity-60"
          disabled={checkingEmail}
        >
          {checkingEmail ? "Verificando..." : "Avançar"}
        </button>
      </div>
    </>
  );
}
