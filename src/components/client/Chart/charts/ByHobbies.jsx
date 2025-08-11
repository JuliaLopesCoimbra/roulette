"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dadosHobbies = [
  { hobby: "Futebol", usuarios: 300 },
  { hobby: "Leitura", usuarios: 240 },
  { hobby: "Cinema", usuarios: 180 },
  { hobby: "Jogos", usuarios: 120 },
  { hobby: "Culinária", usuarios: 100 },
  { hobby: "Viagens", usuarios: 80 },
];

const cores = ["#facc15", "#1e3a8a", "#34d399", "#9333ea", "#f43f5e", "#3b82f6"];

export default function ByHobbies() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição de Hobbies dos Usuários</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dadosHobbies}
            dataKey="usuarios"
            nameKey="hobby"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={60}
            fill="#8884d8"
            label={({ percent, hobby }) =>
              `${(percent * 100).toFixed(0)}%`
            }
          >
            {dadosHobbies.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} usuários`, ""]}
            contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#555" }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
