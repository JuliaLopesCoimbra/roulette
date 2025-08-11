// DashboardUsuarios.jsx
"use client";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const dados = [
  { mes: "Jan", usuarios: 800, novos: 300, sessao: 5.2, conversoes: 120, cliques: 500, retencao: 60 },
  { mes: "Fev", usuarios: 900, novos: 320, sessao: 5.3, conversoes: 130, cliques: 520, retencao: 62 },
  { mes: "Mar", usuarios: 950, novos: 330, sessao: 5.1, conversoes: 140, cliques: 540, retencao: 61 },
  { mes: "Abr", usuarios: 1000, novos: 350, sessao: 5.4, conversoes: 160, cliques: 600, retencao: 65 },
  { mes: "Mai", usuarios: 1100, novos: 370, sessao: 5.5, conversoes: 180, cliques: 620, retencao: 67 },
  { mes: "Jun", usuarios: 1150, novos: 390, sessao: 5.6, conversoes: 200, cliques: 650, retencao: 68 },
  { mes: "Jul", usuarios: 1300, novos: 420, sessao: 5.8, conversoes: 220, cliques: 700, retencao: 70 },
  { mes: "Ago", usuarios: 1400, novos: 450, sessao: 6.0, conversoes: 250, cliques: 730, retencao: 72 },
  { mes: "Set", usuarios: 1350, novos: 430, sessao: 5.9, conversoes: 240, cliques: 720, retencao: 71 },
  { mes: "Out", usuarios: 1500, novos: 470, sessao: 6.2, conversoes: 270, cliques: 750, retencao: 74 },
  { mes: "Nov", usuarios: 1600, novos: 490, sessao: 6.3, conversoes: 290, cliques: 780, retencao: 75 },
  { mes: "Dez", usuarios: 1700, novos: 510, sessao: 6.5, conversoes: 310, cliques: 800, retencao: 77 },
];

dados.forEach((d) => {
  d.conversao = ((d.conversoes / d.cliques) * 100).toFixed(1);
});

export default function Funil() {
  return (
    <div className="bg-[#121212] text-white p-6 space-y-8">
      <h2 className="text-2xl font-bold">Funil de Conversões</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Line dataKey="usuarios" stroke="#3b82f6" name="Usuários Totais" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="novos" fill="#10b981" name="Novos Usuários" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Line dataKey="sessao" stroke="#facc15" name="Tempo Sessão (min)" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="conversoes" fill="#8b5cf6" name="Conversões" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Line dataKey="cliques" stroke="#f97316" name="Cliques" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Line dataKey="conversao" stroke="#f87171" name="Taxa de Conversão (%)" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Line dataKey="retencao" stroke="#1e3a8a" name="Retenção (%)" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dados}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="mes" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cliques" fill="#3b82f6" name="Cliques" />
            <Bar dataKey="conversoes" fill="#f43f5e" name="Conversões" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
