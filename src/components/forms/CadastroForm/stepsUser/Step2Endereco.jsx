"use client";
import { useFormContext } from "react-hook-form";
import ProgressDots from "../ProgressDots";
import { limparCEP, validarCEP, buscarEnderecoPorCEP } from "../../../../utils/validators";

export default function Step2Endereco({ step, setStep }) {
  const { register, setValue, trigger, formState: { errors } } = useFormContext();

  async function handleCEPChange(e) {
    const cep = limparCEP(e.target.value);
    setValue("cep", cep);
    if (validarCEP(cep)) {
      try {
        const addr = await buscarEnderecoPorCEP(cep);
        setValue("rua", addr.rua);
        setValue("bairro", addr.bairro);
        setValue("cidade", addr.cidade);
        setValue("estado", addr.estado);
      } catch {
        // Silencia erros de CEP não encontrado
      }
    }
  }

  return (
    <>
      <div className="absolute top-10 z-10">
        <button onClick={() => setStep(1)} className="text-[#fb4667] hover:text-[#ff2d53]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-12">
        <label>CEP</label>
        <input
          {...register("cep", { required: "Campo obrigatório", onChange: handleCEPChange })}
          className="w-full p-2 rounded-md bg-[#ffffff] text-black placeholder:text-[#bfbfbf] border border-transparent focus:border-[#fb4667] focus:outline-none"
          placeholder="Digite seu CEP"
        />
        {errors.cep && <p className="text-[#ef4444] text-sm">{errors.cep.message}</p>}
      </div>

      <div>
        <label>Rua</label>
        <input {...register("rua")} className="w-full p-2 rounded-md bg-[#ffffff] text-black border border-gray-700 focus:border-[#fb4667]" placeholder="Rua" readOnly />
      </div>

      <div>
        <label>Número</label>
        <input
          {...register("numero", { required: "Campo obrigatório" })}
          className="w-full p-2 rounded-md bg-[#ffffff] text-black placeholder:text-[#bfbfbf] border border-transparent focus:border-[#fb4667] focus:outline-none"
          placeholder="Número da residência"
        />
        {errors.numero && <p className="text-[#ef4444] text-sm">{errors.numero.message}</p>}
      </div>

      <div>
        <label>Bairro</label>
        <input {...register("bairro")} className="w-full p-2 rounded-md bg-[#ffffff] text-black border border-gray-700 focus:border-[#fb4667]" placeholder="Bairro" readOnly />
      </div>

      <div>
        <label>Cidade</label>
        <input {...register("cidade")} className="w-full p-2 rounded-md bg-[#ffffff] text-black border border-gray-700 focus:border-[#fb4667]" placeholder="Cidade" readOnly />
      </div>

      <div>
        <label>Estado</label>
        <input {...register("estado")} className="w-full p-2 rounded-md bg-[#ffffff] text-black border border-gray-700 focus:border-[#fb4667]" placeholder="Estado" readOnly />
      </div>

      <ProgressDots step={step} />

      <div className="flex flex-col items-center justify-center mt-8 space-y-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await trigger(["cep", "rua", "numero", "bairro", "cidade", "estado"]);
            if (ok) setStep(3);
          }}
          className="px-4 py-2 bg-[#fb4667] text-white rounded hover:bg-[#fd2d53] transition font-semibold"
        >
          Avançar
        </button>
      </div>
    </>
  );
}
