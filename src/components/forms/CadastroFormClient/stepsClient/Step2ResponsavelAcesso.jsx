"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { URL_BASE } from "../../../../utils/api";
// === nome e sobrenome ===
const hasTwoNames = (v = "") => {
  const words = v
    .trim()
    .split(/\s+/)
    .filter(w =>
      /[\p{L}][\p{L}-]*[\p{L}]/u.test(w) && w.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\-]/g, "").length >= 2
    );
  return words.length >= 2;
};

// === mascaras já existentes ===
const maskCPF = (v = "") =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCell = (v = "") =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

// === valida CPF ===
const validaCPF = (cpf) => {
  cpf = (cpf || "").replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  let resto = 11 - (soma % 11);
  let dv1 = resto >= 10 ? 0 : resto;
  if (dv1 !== parseInt(cpf.charAt(9), 10)) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  resto = 11 - (soma % 11);
  let dv2 = resto >= 10 ? 0 : resto;
  return dv2 === parseInt(cpf.charAt(10), 10);
};

export default function Step2ResponsavelAcesso({ onNext, onBack }) {
  const {
    register,
    setValue,
    watch,
    trigger,
    setError, 
    clearErrors,
    getValues,
    formState: { errors },
  } = useFormContext();

  const password = watch("password");

  // 👁️‍🗨️ controles de visibilidade
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 const [checkingEmail, setCheckingEmail] = useState(false);

 async function verifyEmailServer(email) {
  if (!email) return { is_valid: false, exists: false, status: "invalid" };

  const res = await fetch(
    `${URL_BASE}/clients-verify/verify-email?email=${encodeURIComponent(email)}`,
    { method: "GET" }
  );

  if (!res.ok) throw new Error("Falha ao verificar e-mail");

  return await res.json();
}


   const handleNext = async () => {
    // 1) validações locais do RHF
    const ok = await trigger([
      "responsable_name",
      "doc_responsable",
      "number_cellphone",
      "email",
      "password",
      "confirm_password",
    ]);
    if (!ok) return;

    // 2) validação remota do e-mail
    try {
      setCheckingEmail(true);
      const email = getValues("email");
      const data = await verifyEmailServer(email);

      if (data?.is_valid && !data?.exists) {
        clearErrors("email");
        onNext();
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
      <h2 className="text-2xl font-semibold text-center md:text-left">
        Responsável & Acesso
      </h2>
      <p className="text-sm text-gray-300">
        Dados do responsável e criação de acesso.
      </p>

      {/* Nome do responsável */}
      <div>
        <label className="block mb-1 text-sm font-medium">Responsável pela empresa</label>
        <input
          {...register("responsable_name", {
            required: "Campo obrigatório",
            validate: (v) => hasTwoNames(v) || "Digite nome e sobrenome completos",
          })}
          onBlur={(e) => {
            const norm = e.target.value
              .trim()
              .replace(/\s+/g, " ")
              .split(" ")
              .map(s => s[0]?.toUpperCase() + s.slice(1).toLowerCase())
              .join(" ");
            e.target.value = norm;
          }}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Ex.: João Silva"
        />
        {errors.responsable_name && (
          <p className="text-[#ef4444] text-sm mt-1">
            {errors.responsable_name.message}
          </p>
        )}
      </div>

      {/* CPF */}
      <div>
        <label className="block mb-1 text-sm font-medium">CPF do responsável</label>
        <input
          {...register("doc_responsable", {
            required: "Campo obrigatório",
            validate: (v) => validaCPF(v) || "CPF inválido",
          })}
          onChange={(e) => setValue("doc_responsable", maskCPF(e.target.value))}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="000.000.000-00"
        />
        {errors.doc_responsable && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.doc_responsable.message}</p>
        )}
      </div>

      {/* Celular */}
      <div>
        <label className="block mb-1 text-sm font-medium">Telefone/WhatsApp</label>
        <input
          {...register("number_cellphone", { required: "Campo obrigatório" })}
          onChange={(e) => setValue("number_cellphone", maskCell(e.target.value))}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="(11) 91234-5678"
        />
        {errors.number_cellphone && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.number_cellphone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 text-sm font-medium">Email corporativo</label>
        <input
          type="email"
          {...register("email", {
            required: "Campo obrigatório",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="contato@empresa.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Senha + 👁️ */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium">Senha</label>
        <input
          type={showPassword ? "text" : "password"}
          {...register("password", {
            required: "Campo obrigatório",
            validate: (v) =>
              v.length >= 12 || "A senha deve ter no mínimo 12 caracteres",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:])[A-Za-z\d@$!%*?&.,;:]{12,}$/,
              message:
                "A senha deve conter: min. 12 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
            },
          })}
          className="w-full p-2 pr-10 rounded-md bg-[#2c2c2e] text-white border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Crie uma senha forte"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-[36px] text-gray-300 hover:text-white"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            // olho aberto
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            // olho cortado
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.132-3.368M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18" />
            </svg>
          )}
        </button>
        {errors.password && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmação de senha + 👁️ */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium">Confirmar senha</label>
        <input
          type={showConfirm ? "text" : "password"}
          {...register("confirm_password", {
            required: "Confirme sua senha",
            validate: (v) => v === password || "As senhas não coincidem",
          })}
          className="w-full p-2 pr-10 rounded-md bg-[#2c2c2e] text-white border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Repita a senha"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3 top-[36px] text-gray-300 hover:text-white"
          tabIndex={-1}
          aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
        >
          {showConfirm ? (
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
        {errors.confirm_password && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.confirm_password.message}</p>
        )}
      </div>

    <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-transparent border border-white/20 rounded hover:bg-white/10 transition font-medium"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold disabled:opacity-60"
          disabled={checkingEmail}
        >
          {checkingEmail ? "Verificando..." : "Continuar"}
        </button>
      </div>
    </>
  );
}
