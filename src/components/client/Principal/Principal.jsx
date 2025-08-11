"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Principal() {
  const router = useRouter();
  const toGoBusiness = () => {
    router.push(`/pages/client/business`);
  };

  // Dados mockados
  const [mockData] = useState({
    nomeEmpresa: "PIC BRAND",
    anunciosAtivos: 3,
    visualizacoes: 1240,
    cliques: 305,
    saldo: 72.50,
    ultimaAtividade: "29/06/2025 às 14:22",
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Olá, {mockData.nomeEmpresa} 👋</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#2c2c2e] p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Anúncios Ativos</p>
          <h3 className="text-3xl font-semibold">{mockData.anunciosAtivos}</h3>
        </div>

        <div className="bg-[#2c2c2e] p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Visualizações Totais</p>
          <h3 className="text-3xl font-semibold">{mockData.visualizacoes}</h3>
        </div>

        <div className="bg-[#2c2c2e] p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Cliques Totais</p>
          <h3 className="text-3xl font-semibold">{mockData.cliques}</h3>
        </div>

        <div className="bg-[#2c2c2e] p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Saldo Disponível</p>
          <h3 className="text-3xl font-semibold text-green-400">
            R$ {mockData.saldo.toFixed(2)}
          </h3>
        </div>

        <div className="bg-[#2c2c2e] p-4 rounded-lg shadow col-span-1 sm:col-span-2">
          <p className="text-sm text-gray-400">Última atividade</p>
          <p className="text-md">{mockData.ultimaAtividade}</p>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-600 text-yellow-300 p-4 rounded-lg">
        <p><strong>Aviso:</strong> Seu saldo está abaixo de R$ 100. Recarregue para manter seus anúncios ativos.</p>
      </div>

      <button
        className="px-6 py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
        onClick={toGoBusiness}
      >
        Criar Novo Anúncio
      </button>
    </div>
  );
}
