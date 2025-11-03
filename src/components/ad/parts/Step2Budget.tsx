"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useForm, Controller, useWatch } from "react-hook-form";

type Props = {
  goal: "click" | "view"; // vindo da etapa 1
  next: () => void;
  back: () => void;
};

type FormValues = {
  budgetType: "diario" | "total";
  targetUnits: number;        // quantos cliques/views deseja atingir (OBRIGATÓRIO)
  startISO: string;           // datetime-local
  useEnd: boolean;
  endISO?: string;            // datetime-local (opcional)
  days: number;               // atalho quando não usa end (>=1)
};

const MINIMO = 10_000;
const PRICE = { click: 14, view: 0.1 } as const;

export default function Step2Budget({ goal, next, back }: Props) {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      budgetType: "diario",
      targetUnits: 0,
      startISO: "",
      useEnd: false,
      endISO: "",
      days: 1,
    },
  });

  const watchAll = useWatch({ control });
  const unitPrice = PRICE[goal];

  // dias planejados
  const diasPlanejados = useMemo(() => {
    const { startISO, useEnd, endISO, days } = watchAll;
    if (!startISO) return Math.max(1, Number(days) || 1);

    const start = new Date(startISO);
    if (Number.isNaN(start.getTime())) return Math.max(1, Number(days) || 1);

    if (useEnd && endISO) {
      const end = new Date(endISO);
      if (!Number.isNaN(end.getTime())) {
        const ms = end.getTime() - start.getTime();
        const d = Math.ceil(ms / (1000 * 60 * 60 * 24));
        return Math.max(1, d);
      }
    }
    return Math.max(1, Number(days) || 1);
  }, [watchAll]);

  // total ideal para atingir a meta de unidades
  const requiredTotal = useMemo(() => {
    const u = Number(watchAll.targetUnits) || 0;
    return u * unitPrice;
  }, [watchAll.targetUnits, unitPrice]);

  // orçamento efetivo (alocado) conforme tipo
  const { totalPlanejado, valorDiario } = useMemo(() => {
    if (watchAll.budgetType === "total") {
      return { totalPlanejado: requiredTotal, valorDiario: requiredTotal / diasPlanejados };
    }
    // diário: distribuir o total requerido pelos dias
    const perDay = requiredTotal / diasPlanejados;
    return { totalPlanejado: perDay * diasPlanejados, valorDiario: perDay };
  }, [watchAll.budgetType, requiredTotal, diasPlanejados]);

  // “orçar automaticamente” assim que dias/meta mudarem
  // (aqui apenas recalculamos, mas se houver API externa, chamar aqui)
  // useEffect(() => { fetchOrcamento(requiredTotal, diasPlanejados) }, [requiredTotal, diasPlanejados])

  // validações principais
  const startIsFuture = useMemo(() => {
    if (!watchAll.startISO) return false;
    const start = new Date(watchAll.startISO);
    return start.getTime() > Date.now();
  }, [watchAll.startISO]);

  const endIsValid = useMemo(() => {
    if (!watchAll.useEnd) return true;
    if (!watchAll.startISO || !watchAll.endISO) return false;
    const s = new Date(watchAll.startISO).getTime();
    const e = new Date(watchAll.endISO).getTime();
    return e > s;
  }, [watchAll.useEnd, watchAll.startISO, watchAll.endISO]);

  const minimoOK = totalPlanejado >= MINIMO;
  const canContinue =
    minimoOK &&
    startIsFuture &&
    endIsValid &&
    (Number(watchAll.targetUnits) || 0) > 0;

  // feedback de entrega estimada (pelo total efetivo)
  const entregasEstimadas = Math.floor(totalPlanejado / unitPrice);

  const onSubmit = () => {
    if (!canContinue) return;
    // aqui você pode persistir no contexto / store antes de avançar
    next();
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.45 }}
      className="max-w-3xl w-full p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2">Orçamento & Programação</h2>

      {/* Regras rápidas */}
      <div className="text-sm text-gray-300 mb-6 space-y-1">
        <p><strong>Objetivo:</strong> {goal === "click" ? "Cliques" : "Views"} </p>
        <p className="text-yellow-300/90"><strong>Investimento mínimo:</strong> {formatBRL(MINIMO)} (soma total da campanha).</p>
      </div>

      {/* 1) Meta de entrega (OBRIGATÓRIO) */}
      <div className="mb-6">
        <label className="block text-sm text-gray-200 mb-1">
          Quantos {goal === "click" ? "cliques" : "views"} você quer atingir? *
        </label>
        <input
          type="number"
          min={1}
          step={1}
          className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"
          {...register("targetUnits", {
            required: "Informe a quantidade desejada.",
            min: { value: 1, message: "Deve ser pelo menos 1." },
            valueAsNumber: true,
          })}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
        />
        {errors.targetUnits && (
          <p className="mt-1 text-xs text-red-300">{errors.targetUnits.message}</p>
        )}
        <p className="mt-2 text-xs text-gray-300">
          Orçamento baseado em meta: <strong>{formatBRL(requiredTotal)}</strong> (meta × preço unitário).
        </p>
      </div>

      {/* 2) Tipo de orçamento (diário ou total) */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm text-gray-200">Tipo de orçamento</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="diario"
              {...register("budgetType")}
              defaultChecked
            />
            Diário
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="total" {...register("budgetType")} />
            Total
          </label>
        </div>

        {watchAll.budgetType === "diario" ? (
          <div className="col-span-1 sm:col-span-2 text-xs text-gray-300">
            Valor diário estimado: <strong>{formatBRL(valorDiario)}</strong> × {diasPlanejados} dia(s) ={" "}
            <strong>{formatBRL(totalPlanejado)}</strong>
          </div>
        ) : (
          <div className="col-span-1 sm:col-span-2 text-xs text-gray-300">
            Total planejado informado: <strong>{formatBRL(totalPlanejado)}</strong>
          </div>
        )}
      </div>

      {/* 3) Programação (start futuro + duração) */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block text-sm text-gray-200 mb-1">Início (data e hora) *</label>
          <input
            type="datetime-local"
            className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"
            {...register("startISO", { required: "Informe data e hora de início." })}
          />
          {!startIsFuture && watchAll.startISO && (
            <p className="mt-1 text-xs text-red-300">O início deve estar no futuro.</p>
          )}
          {errors.startISO && (
            <p className="mt-1 text-xs text-red-300">{errors.startISO.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("useEnd")} id="useEnd" />
          <label htmlFor="useEnd" className="text-sm">Definir data de término</label>
        </div>

        {watchAll.useEnd ? (
          <div>
            <label className="block text-sm text-gray-200 mb-1">Término (data e hora)</label>
            <input
              type="datetime-local"
              className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"
              {...register("endISO")}
            />
            {!endIsValid && (
              <p className="mt-1 text-xs text-red-300">O término deve ser depois do início.</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-200 mb-1">Duração (em dias)</label>
            <input
              type="number"
              min={1}
              step={1}
              className="w-full rounded-lg bg-white/10 px-3 py-2 outline-none"
              {...register("days", {
                required: true,
                min: { value: 1, message: "Mínimo 1 dia." },
                valueAsNumber: true,
              })}
              onChange={(e) => setValue("days", Math.max(1, Number(e.target.value) || 1))}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
            />
            <p className="mt-1 text-xs text-gray-300">Atualizamos o orçamento assim que você define os dias.</p>
          </div>
        )}
      </div>

      {/* 4) Feedback do orçamento / entrega */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Total planejado</span>
            <strong className={minimoOK ? "text-green-300" : "text-red-300"}>
              {formatBRL(totalPlanejado)}
            </strong>
          </div>
          {!minimoOK && (
            <p className="text-xs text-red-300">
              Mínimo é {formatBRL(MINIMO)}. Faltam {formatBRL(MINIMO - totalPlanejado)}.
            </p>
          )}
          <div className="flex justify-between">
            <span>Entrega estimada</span>
            <strong>
              {entregasEstimadas.toLocaleString("pt-BR")} {goal === "click" ? "cliques" : "views"}
            </strong>
          </div>
         
        </div>
      </div>

      {/* Ações */}
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={back}
          className="w-40 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-semibold"
        >
          ← Voltar
        </button>
        <button
          type="submit"
          disabled={!canContinue}
          className={`flex-1 py-3 rounded-lg font-semibold transition
            ${canContinue ? "bg-[#fb4667] hover:bg-[#fc3358]" : "bg-white/10 cursor-not-allowed"}`}
        >
          Continuar →
        </button>
      </div>
    </motion.form>
  );
}

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
