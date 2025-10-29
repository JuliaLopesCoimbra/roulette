"use client";
import { useFormContext } from "react-hook-form";
import ProgressDots from "../ProgressDots";
import { formatCPF, validarCPF, formatCelular } from "../../../../utils/validators";

export default function Step1DadosPessoais({ step, setStep, router }) {
  const { register, setValue, trigger, formState: { errors } } = useFormContext();

  return (
    <>
      <div className="absolute top-10 z-10">
        <button onClick={() => router.back()} className="text-[#973bfe] hover:text-purple-900">
          {/* ícone voltar */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div>
        <label>Nome Completo</label>
        <input
          {...register("nome", {
            required: "Campo obrigatório",
            validate: (v) =>
              /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+)+$/.test(v?.trim() || "") ||
              "Digite seu nome completo (nome e sobrenome)",
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="Digite seu nome"
          autoComplete="off"
        />
        {errors.nome && <p className="text-[#ef4444] text-sm">{errors.nome.message}</p>}
      </div>

      <div>
        <label>CPF</label>
        <input
          {...register("cpf", {
            required: "Campo obrigatório",
            validate: (v) => validarCPF(v) || "CPF inválido",
            onChange: (e) => setValue("cpf", formatCPF(e.target.value)),
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="000.000.000-00"
          autoComplete="off"
        />
        {errors.cpf && <p className="text-[#ef4444] text-sm">{errors.cpf.message}</p>}
      </div>

      <div>
        <label>Celular</label>
        <input
          {...register("celular", {
            required: "Campo obrigatório",
            onChange: (e) => setValue("celular", formatCelular(e.target.value)),
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white placeholder:text-[#bfbfbf] border border-transparent focus:border-[#973bfe] focus:outline-none"
          placeholder="(11) 9 8765-4321"
          autoComplete="off"
        />
        {errors.celular && <p className="text-[#ef4444] text-sm">{errors.celular.message}</p>}
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
              const idade =
                hoje.getFullYear() -
                data.getFullYear() -
                (hoje < new Date(hoje.getFullYear(), data.getMonth(), data.getDate()) ? 1 : 0);
              return idade >= 18 || "Você precisa ter pelo menos 18 anos";
            },
          })}
          className="w-full p-2 rounded-md bg-[#2c2c2e] text-white border border-transparent focus:border-[#973bfe] focus:outline-none"
        />
        {errors.nascimento && (
          <p className="text-[#ef4444] text-sm">{errors.nascimento.message}</p>
        )}
      </div>

      <div>
  <label className="block mb-1">Sexo</label>
  <div className="flex gap-4 text-sm">
    <label className="inline-flex items-center gap-2">
      <input
        type="radio"
        value="Feminino"
        {...register("gender", { required: "Selecione seu sexo" })}
        className="accent-purple-700"
      />
      Feminino
    </label>
    <label className="inline-flex items-center gap-2">
      <input
        type="radio"
        value="Masculino"
        {...register("gender", { required: "Selecione seu sexo" })}
        className="accent-purple-700"
      />
      Masculino
    </label>
  </div>
  {errors.gender && <p className="text-[#ef4444] text-sm">{errors.gender.message}</p>}
</div>

      <ProgressDots step={step} />

      <div className="flex flex-col items-center justify-center mt-8 space-y-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await trigger(["nome", "cpf", "celular", "nascimento", "gender"]);
            if (ok) setStep(2);
          }}
          className="px-4 py-2 bg-[#973bfe] text-white rounded hover:bg-purple-900 transition font-semibold"
        >
          Avançar
        </button>
        <p className="text-sm text-gray-200">
          Já tem login?{" "}
          <a href="/pages/user/signIn" className="text-purple-400 font-semibold hover:underline">
            Acesse sua conta
          </a>
        </p>
      </div>
    </>
  );
}
