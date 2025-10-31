"use client";
import React from "react";
import { useFormContext } from "react-hook-form";

const maskCEP = (v = "") =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

export default function Step3Endereco({ onBack, isSubmitting }) {
  const { register, setValue, formState: { errors } } = useFormContext();

  return (
    <>
      <h2 className="text-2xl font-semibold text-center md:text-left">Endereço</h2>
      <p className="text-sm text-gray-300">Complete o endereço da empresa e finalize o cadastro.</p>

      <div>
        <label className="block mb-1 text-sm font-medium">CEP</label>
        <input
          {...register("cep", { required: "Campo obrigatório", minLength: { value: 9, message: "CEP incompleto" } })}
          onChange={(e) => setValue("cep", maskCEP(e.target.value))}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="00000-000"
          inputMode="numeric"
        />
        {errors.cep && <p className="text-[#ef4444] text-sm mt-1">{errors.cep.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium">Rua</label>
          <input
            {...register("street", { required: "Campo obrigatório" })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="Rua das Empresas"
          />
          {errors.street && <p className="text-[#ef4444] text-sm mt-1">{errors.street.message}</p>}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Número</label>
          <input
            {...register("number", { required: "Campo obrigatório" })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="123"
          />
          {errors.number && <p className="text-[#ef4444] text-sm mt-1">{errors.number.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block mb-1 text-sm font-medium">Bairro</label>
          <input
            {...register("neighborhood", { required: "Campo obrigatório" })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="Centro"
          />
          {errors.neighborhood && <p className="text-[#ef4444] text-sm mt-1">{errors.neighborhood.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-1 text-sm font-medium">Cidade</label>
          <input
            {...register("city", { required: "Campo obrigatório" })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="São Paulo"
          />
          {errors.city && <p className="text-[#ef4444] text-sm mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-sm font-medium">Estado (UF)</label>
          <input
            {...register("state", {
              required: "Campo obrigatório",
              minLength: { value: 2, message: "UF inválida" },
              maxLength: { value: 2, message: "UF deve ter 2 letras" },
            })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="SP"
            onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
          />
          {errors.state && <p className="text-[#ef4444] text-sm mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">País</label>
          <input
            {...register("country", { required: "Campo obrigatório" })}
            className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border-transparent focus:border-[#973bfe] focus:outline-none"
            placeholder="Brasil"
          />
          {errors.country && <p className="text-[#ef4444] text-sm mt-1">{errors.country.message}</p>}
        </div>
      </div>

      {/* Termos */}
      <div className="flex items-center gap-3 pt-1">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            {...register("aceita_termos", { required: "Você precisa aceitar os termos de uso de dados." })}
            className="sr-only peer"
          />
          <div className="w-5 h-5 bg-[#973bfe] rounded-full peer-checked:ring-2 peer-checked:ring-[#973bfe] peer-checked:border-4 peer-checked:border-black transition-all duration-200"></div>
        </label>
        <label className="text-sm">
          Eu aceito os <a href="#" className="underline">termos de uso de dados</a>.
        </label>
      </div>
      {errors.aceita_termos && <p className="text-[#ef4444] text-sm">{errors.aceita_termos.message}</p>}

      <div className="flex justify-between pt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-transparent border border-white/20 rounded hover:bg-white/10 transition font-medium"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
        >
          {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
        </button>
      </div>
    </>
  );
}
