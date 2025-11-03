"use client";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { URL_BASE } from "../../../../utils/api";

// máscaras/validações locais
const maskCNPJ = (v = "") =>
  v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

const validaCNPJ = (cnpj) => {
  cnpj = (cnpj || "").replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  let tamanho = 12,
    numeros = cnpj.substring(0, tamanho),
    digitos = cnpj.substring(tamanho),
    soma = 0,
    pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  tamanho = 13;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1), 10);
};

export default function Step1Empresa({ step, onNext }) {
  const {
    register,
    setValue,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [checkingCnpj, setCheckingCnpj] = useState(false);

  async function verifyCnpjServer(cnpjMasked) {
    const raw = (cnpjMasked || "").replace(/\D/g, "");
    if (!raw) return { is_valid: false, exists: false, status: "invalid" };

    const res = await fetch(
      `${URL_BASE}/clients-verify/verify-cnpj?cnpj=${encodeURIComponent(raw)}`,
      { method: "GET" }
    );
    if (!res.ok) throw new Error("Falha ao verificar CNPJ");
    return await res.json(); // { cnpj, is_valid, exists, status, message }
  }

  const handleNext = async () => {
    if (checkingCnpj) return; // evita clique duplo

    // 1) validações locais (inclui dígitos do CNPJ)
    const ok = await trigger(["corporate_name", "cnpj", "fantasy_name"]);
    if (!ok) return;

    // 2) validação remota
    try {
      setCheckingCnpj(true);
      const cnpjMasked = getValues("cnpj");
      const data = await verifyCnpjServer(cnpjMasked);

      if (data?.is_valid && !data?.exists) {
        clearErrors("cnpj");
        onNext();
      } else {
        setError("cnpj", {
          type: "server",
          message: data?.exists ? "CNPJ já cadastrado." : "CNPJ inválido.",
        });
      }
    } catch (e) {
      setError("cnpj", {
        type: "server",
        message: "Não foi possível validar o CNPJ agora. Tente novamente.",
      });
    } finally {
      setCheckingCnpj(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center md:text-left">Dados da empresa</h1>
      <p className="text-sm text-gray-300">Comece preenchendo as informações básicas.</p>

      {/* Razão social */}
      <div>
        <label className="block mb-1 text-sm font-medium">Razão Social</label>
        <input
          {...register("corporate_name", { required: "Campo obrigatório" })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Empresa Exemplo LTDA"
        />
        {errors.corporate_name && <p className="text-[#ef4444] text-sm mt-1">{errors.corporate_name.message}</p>}
      </div>

      {/* Nome fantasia (opcional) */}
      <div>
        <label className="block mb-1 text-sm font-medium">Nome Fantasia</label>
        <input
          {...register("fantasy_name")}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Pic Brand"
        />
      </div>

      {/* CNPJ */}
      <div>
        <label className="block mb-1 text-sm font-medium">CNPJ</label>
        <input
          {...register("cnpj", {
            required: "Campo obrigatório",
            validate: (v) => validaCNPJ(v) || "CNPJ inválido",
          })}
          onChange={(e) => setValue("cnpj", maskCNPJ(e.target.value))}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="00.000.000/0001-00"
          inputMode="numeric"
          autoComplete="off"
        />
        {errors.cnpj && <p className="text-[#ef4444] text-sm mt-1">{errors.cnpj.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleNext}
          className="px-4 py-2 bg-[#fb4667] text-white rounded hover:bg-[#fe3157] transition font-semibold disabled:opacity-60"
          disabled={checkingCnpj}
        >
          {checkingCnpj ? "Verificando..." : "Continuar"}
        </button>
      </div>
    </>
  );
}
