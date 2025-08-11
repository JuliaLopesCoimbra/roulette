"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dadosEstados = [
  { estado: "SP", usuarios: 950 },
  { estado: "RJ", usuarios: 730 },
  { estado: "MG", usuarios: 620 },
  { estado: "RS", usuarios: 480 },
  { estado: "PR", usuarios: 450 },
  { estado: "BA", usuarios: 420 },
  { estado: "SC", usuarios: 410 },
  { estado: "PE", usuarios: 390 },
  { estado: "CE", usuarios: 370 },
  { estado: "DF", usuarios: 350 },
  { estado: "GO", usuarios: 340 },
  { estado: "PA", usuarios: 310 },
  { estado: "ES", usuarios: 280 },
  { estado: "AM", usuarios: 240 },
  { estado: "MT", usuarios: 220 },
  { estado: "MA", usuarios: 200 },
  { estado: "PB", usuarios: 180 },
  { estado: "RN", usuarios: 170 },
  { estado: "PI", usuarios: 160 },
  { estado: "AL", usuarios: 150 },
  { estado: "MS", usuarios: 140 },
  { estado: "SE", usuarios: 130 },
  { estado: "TO", usuarios: 120 },
  { estado: "RO", usuarios: 110 },
  { estado: "AP", usuarios: 100 },
  { estado: "RR", usuarios: 90 },
  { estado: "AC", usuarios: 80 },
];

export default function ByStates() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição de Usuários por Estado</h3>
      <ResponsiveContainer width="100%" height={700}>
        <BarChart
  layout="vertical"
  data={[...dadosEstados].sort((a, b) => b.usuarios - a.usuarios)}
  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
>

          <CartesianGrid stroke="#444" />
          <XAxis type="number" tick={{ fill: "#e5e5e5" }} />
          <YAxis
            dataKey="estado"
            type="category"
            tick={{ fill: "#e5e5e5" }}
            width={40}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar
            dataKey="usuarios"
            fill="#1e3a8a"
            name="Usuários"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
