"use client";
import React, { useEffect, useState } from "react";

type BudgetProps = {
  onChange?: (data: { tipo: "diario" | "total"; valor: number; valorBRL: string }) => void;
};

function formatBRLstr(v: string) {
  const only = v.replace(/\D/g, "");
  const n = (parseFloat(only || "0") / 100);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBRLtoNumber(brl: string) {
  const only = brl.replace(/\D/g, "");
  return (parseFloat(only || "0") / 100) || 0;
}

export default function Budget({ onChange }: BudgetProps) {
  const [tipo, setTipo] = useState<"diario" | "total">("diario");
  const [valorBRL, setValorBRL] = useState("");

  useEffect(() => {
    onChange?.({ tipo, valor: parseBRLtoNumber(valorBRL), valorBRL });
  }, [tipo, valorBRL, onChange]);

  return (
    <div className="p-6 bg-gray-800 rounded border border-gray-700 shadow">
      <p className="text-large text-gray-300 mb-4 font-bold">Orçamento da Campanha</p>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">Tipo de Orçamento</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "diario" | "total")}
            className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="diario">Orçamento Diário</option>
            <option value="total">Orçamento Total</option>
          </select>
        </div>

        <div className="w-full md:w-2/3">
          <label className="block text-sm font-medium mb-1 text-gray-200">
            {tipo === "diario" ? "Valor diário (R$)" : "Valor total (R$)"}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={valorBRL}
            onChange={(e) => setValorBRL(formatBRLstr(e.target.value))}
            placeholder={tipo === "diario" ? "Ex: R$ 1.000,00/dia" : "Ex: R$ 10.000,00"}
            className="w-full p-3 bg-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
    </div>
  );
}
