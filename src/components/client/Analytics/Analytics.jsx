"use client";
import { useState } from "react";

export default function Analytics() {
  // Mock de análise por anúncio
  const [dados] = useState([
    {
      nome: "Viagem República Dominicana",
      tipo: "CPC",
      views: 540,
      cliques: 180,
      ctr: "33%",
      status: "Bom",
      sugestao: "Continue com esse criativo, ótima taxa de clique.",
    },
    {
      nome: "Curso de Inglês Online",
      tipo: "CPC",
      views: 380,
      cliques: 40,
      ctr: "10%",
      status: "Fraco",
      sugestao: "Teste outro título ou imagem mais atrativa.",
    },
    {
      nome: "Aprenda a falar Inglês",
      tipo: "CPV",
      views: 700,
      cliques: 60,
      ctr: "8.5%",
      status: "Médio",
      sugestao: "Adicione CTA no final do vídeo para mais cliques.",
    },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Análises e Sugestões</h2>

      <div className="bg-[#2c2c2e] p-6 rounded-lg shadow">
        <p className="text-sm text-gray-300 mb-4">
          Veja o desempenho de cada anúncio com sugestões práticas para melhorar resultados.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-gray-700">
                <th className="py-2 px-4">Anúncio</th>
                <th className="py-2 px-4">Tipo</th>
                <th className="py-2 px-4">Views</th>
                <th className="py-2 px-4">Cliques</th>
                <th className="py-2 px-4">CTR</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Sugestão</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-[#3f3f46] transition">
                  <td className="py-2 px-4">{item.nome}</td>
                  <td className="py-2 px-4">{item.tipo}</td>
                  <td className="py-2 px-4">{item.views}</td>
                  <td className="py-2 px-4">{item.cliques}</td>
                  <td className="py-2 px-4">{item.ctr}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.status === "Bom"
                          ? "bg-green-600"
                          : item.status === "Médio"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-300">{item.sugestao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
