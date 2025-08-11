"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const dadosIdade = [
  { faixa: "13–17", usuarios: 80 },
  { faixa: "18–24", usuarios: 240 },
  { faixa: "25–34", usuarios: 320 },
  { faixa: "35–44", usuarios: 180 },
  { faixa: "45–54", usuarios: 100 },
  { faixa: "55–64", usuarios: 60 },
  { faixa: "65+", usuarios: 30 },
];

export default function ByAge() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição por Faixa Etária</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosIdade}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="faixa" tick={{ fill: "#e5e5e5" }} />
          <YAxis tick={{ fill: "#e5e5e5" }} />
          <Tooltip
            formatter={(value) => [`${value} usuários`, ""]}
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar
            dataKey="usuarios"
             fill="#1e3a8a" // ✅ azul marinho
            name="Usuários"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
