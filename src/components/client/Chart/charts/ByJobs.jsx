"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const dadosProfissoes = [
  { profissao: "Estudante", usuarios: 320 },
  { profissao: "Programador", usuarios: 260 },
  { profissao: "Designer", usuarios: 180 },
  { profissao: "Professor", usuarios: 150 },
  { profissao: "Empreendedor", usuarios: 110 },
  { profissao: "Outros", usuarios: 80 },
];

const cores = [
  "#3b82f6", // Azul
  "#f87171", // Vermelho claro
  "#10b981", // Verde esmeralda
  "#eab308", // Amarelo ouro
  "#8b5cf6", // Roxo
  "#f97316", // Laranja
];


export default function ByJobs() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold text-white">Distribuição dos usúarios por Profissão</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dadosProfissoes}
            dataKey="usuarios"
            nameKey="profissao"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={60}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {dadosProfissoes.map((entry, index) => (
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
