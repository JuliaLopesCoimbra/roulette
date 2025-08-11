"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dadosRedesSociais = [
  { rede: "Instagram", usuarios: 420 },
  { rede: "TikTok", usuarios: 390 },
  { rede: "Facebook", usuarios: 320 },
  { rede: "Twitter", usuarios: 240 },
  { rede: "LinkedIn", usuarios: 200 },
  { rede: "YouTube", usuarios: 380 },
];

export default function BySocialMedias() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição por Rede Social</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={dadosRedesSociais}>
          <defs>
            <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#444" />
          <XAxis dataKey="rede" tick={{ fill: "#e5e5e5" }} />
          <YAxis tick={{ fill: "#e5e5e5" }} />
          <Tooltip
            formatter={(value) => [`${value} usuários`, ""]}
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Area
            type="monotone"
            dataKey="usuarios"
            stroke="#facc15"
            fillOpacity={1}
            fill="url(#colorUsuarios)"
            name="Usuários"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
