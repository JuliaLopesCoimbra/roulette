"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const tiposAnuncio = [
  { name: "CPC (Imagem)", value: 7 },
  { name: "CPV (Vídeo)", value: 3 },
];

const cores = ["#facc15", "#1e3a8a"];


export default function TypeAd() {
  return (
    <div className="bg-[#2c2c2e] p-6 rounded-lg shadow w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Distribuição de Anúncios</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={tiposAnuncio}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {tiposAnuncio.map((entry, index) => (
              <Cell key={index} fill={cores[index % cores.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
