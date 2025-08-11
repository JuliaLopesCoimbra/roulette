"use client";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const desempenhoAnuncios = [
  { nome: "Viagem República Dominicana", views: 350, cliques: 120 },
  { nome: "Curso de Inglês Online", views: 220, cliques: 60 },
  { nome: "Aprenda a falar Inglês", views: 400, cliques: 90 },
];

export default function PerfomanceChart() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-white mb-4">Desempenho por Anúncio</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={desempenhoAnuncios}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="nome" tick={{ fill: "#e5e5e5" }} />
          <YAxis tick={{ fill: "#e5e5e5" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="views" fill="#facc15" name="Visualizações" />
          <Bar dataKey="cliques" fill="#1e3a8a" name="Cliques" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
