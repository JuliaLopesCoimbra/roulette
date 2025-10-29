"use client";
import { useFormContext } from "react-hook-form";
import ProgressDots from "../ProgressDots";
import { validarEmail } from "../../../../utils/validators";

export default function Step3Credenciais({ step, setStep }) {
  const { register, watch, trigger, formState: { errors } } = useFormContext();

  return (
    <>
      <div className="absolute top-10 z-10">
        <button onClick={() => setStep(2)} className="text-[#973bfe] hover:text-purple-900">
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
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="exemplo@email.com"
          autoComplete="off"
          type="email"
        />
        {errors.email && <p className="text-[#ef4444] text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label>Senha</label>
        <input
          type="password"
          {...register("senha", {
            required: "Campo obrigatório",
            minLength: { value: 8, message: "Mínimo 8 caracteres" },
            validate: (v) =>
              /^(?=.*[A-Z])(?=.*\W)/.test(v || "") ||
              "A senha deve conter ao menos 1 letra maiúscula e 1 caractere especial",
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Digite sua senha"
        />
        {errors.senha && <p className="text-[#ef4444] text-sm">{errors.senha.message}</p>}
      </div>

      <div>
        <label>Confirmar Senha</label>
        <input
          type="password"
          {...register("confirmarSenha", {
            required: "Campo obrigatório",
            validate: (v) => v === watch("senha") || "As senhas não coincidem",
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Repita sua senha"
        />
        {errors.confirmarSenha && (
          <p className="text-[#ef4444] text-sm">{errors.confirmarSenha.message}</p>
        )}
      </div>

      <ProgressDots step={step} />

      <div className="flex flex-col items-center justify-center mt-8 space-y-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await trigger(["email", "senha", "confirmarSenha"]);
            if (ok) setStep(4);
          }}
          className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
        >
          Avançar
        </button>
      </div>
    </>
  );
}
