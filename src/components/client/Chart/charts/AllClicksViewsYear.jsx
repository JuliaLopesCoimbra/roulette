"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dadosPorAno = {
  2023: [
    { mes: "Jan", cliques: 120, views: 350 },
    { mes: "Fev", cliques: 200, views: 400 },
    { mes: "Mar", cliques: 180, views: 420 },
    { mes: "Abr", cliques: 250, views: 500 },
    { mes: "Mai", cliques: 300, views: 600 },
    { mes: "Jun", cliques: 280, views: 620 },
    { mes: "Jul", cliques: 310, views: 700 },
    { mes: "Ago", cliques: 330, views: 730 },
    { mes: "Set", cliques: 270, views: 680 },
    { mes: "Out", cliques: 350, views: 750 },
    { mes: "Nov", cliques: 400, views: 800 },
    { mes: "Dez", cliques: 420, views: 850 },
  ],
  2024: [
    { mes: "Jan", cliques: 100, views: 300 },
    { mes: "Fev", cliques: 130, views: 320 },
    { mes: "Mar", cliques: 160, views: 370 },
    { mes: "Abr", cliques: 190, views: 390 },
    { mes: "Mai", cliques: 210, views: 410 },
    { mes: "Jun", cliques: 250, views: 440 },
    { mes: "Jul", cliques: 280, views: 460 },
    { mes: "Ago", cliques: 300, views: 490 },
    { mes: "Set", cliques: 320, views: 520 },
    { mes: "Out", cliques: 350, views: 540 },
    { mes: "Nov", cliques: 370, views: 560 },
    { mes: "Dez", cliques: 400, views: 600 },
  ],
  2025 : [
    { mes: "Jan", cliques: 100, views: 300 },
    { mes: "Fev", cliques: 130, views: 320 },
    { mes: "Mar", cliques: 160, views: 370 },
    { mes: "Abr", cliques: 190, views: 390 },
    { mes: "Mai", cliques: 210, views: 410 },
    { mes: "Jun", cliques: 250, views: 440 },
    { mes: "Jul", cliques: 0, views: 0 },
   
  ],
};

export default function AllClicksViewsYear() {
  const [anoSelecionado, setAnoSelecionado] = useState(2025);
  const dados = dadosPorAno[anoSelecionado];

  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Cliques x Visualizações por Mês</h3>
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
          className="bg-[#1f1f1f] border border-gray-600 text-white rounded px-3 py-1"
        >
          {Object.keys(dadosPorAno).map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="mes" tick={{ fill: "#e5e5e5" }} />
          <YAxis tick={{ fill: "#e5e5e5" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Line
            type="monotone"
            dataKey="cliques"
           stroke="#1e3a8a" // azul marinho
            name="Cliques"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#facc15"
            name="Visualizações"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
