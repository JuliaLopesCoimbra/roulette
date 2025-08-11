"use client";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dadosMarcas = [
  { marca: "Nike", usuarios: 350 },
  { marca: "Adidas", usuarios: 280 },
  { marca: "Apple", usuarios: 250 },
  { marca: "Samsung", usuarios: 220 },
  { marca: "Puma", usuarios: 180 },
  { marca: "Xiaomi", usuarios: 160 },
  { marca: "LG", usuarios: 140 },
  { marca: "Sony", usuarios: 120 },
];

export default function ByMarcas() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição por Marca Favorita</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosMarcas}>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="marca" tick={{ fill: "#e5e5e5" }} />
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
            fill="#3b82f6"
            name="Usuários"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
