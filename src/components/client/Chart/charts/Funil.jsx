"use client";
import React from "react";
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
    <div className="text-white p-6 space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {[
          <LineChart data={dados}>
            <Line dataKey="usuarios" name="Usuários" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>,

          <BarChart data={dados}>
            <Bar dataKey="novos" name="Novos Usuários" fill="#10b981" />
          </BarChart>,

          <LineChart data={dados}>
            <Line dataKey="sessao" name="Tempo de sessão (min)" stroke="#facc15" strokeWidth={2} />
          </LineChart>,

          <BarChart data={dados}>
            <Bar dataKey="conversoes" name="Conversões" fill="#8b5cf6" />
          </BarChart>,

          <LineChart data={dados}>
            <Line dataKey="cliques" name="Cliques" stroke="#f97316" strokeWidth={2} />
          </LineChart>,

          <LineChart data={dados}>
            <Line dataKey="conversao" name="Taxa de Conversão (%)" stroke="#f87171" strokeWidth={2} />
          </LineChart>,

          <LineChart data={dados}>
            <Line dataKey="retencao" name="Retenção (%)" stroke="#1e3a8a" strokeWidth={2} />
          </LineChart>,

          <BarChart data={dados}>
            <Bar dataKey="cliques" name="Cliques" fill="#3b82f6" />
            <Bar dataKey="conversoes" name="Conversões" fill="#f43f5e" />
          </BarChart>,
        ].map((chart, i) => (
          <ResponsiveContainer key={i} width="100%" height={250}>
            {React.cloneElement(
              chart,
              {},
              <>
                <CartesianGrid stroke="rgba(255,255,255,0.15)" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
                />
                <YAxis
                  tick={{ fill: "#fff", fontSize: 12 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.4)" }}
                  tickLine={{ stroke: "rgba(255,255,255,0.4)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.85)",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                />
                <Legend />
                {chart.props.children}
              </>
            )}
          </ResponsiveContainer>
        ))}
      </div>
    </div>
  );
}
