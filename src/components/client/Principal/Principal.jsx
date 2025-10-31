"use client";
import ChartCard from "../../../components/client/Chart/charts-nivo/ChartCard";
import BarsViewsClicks from "../../../components/client/Chart/charts-nivo/BarsViewsClicks";
import DonutAds from "../../../components/client/Chart/charts-nivo/DonutAds";
import CalendarActivity from "../../../components/client/Chart/charts-nivo/CalendarActivity";
import ProfessionDistribution from "../Chart/charts-nivo/ProfessionDistribution";
import AdsPerformance from "../Chart/charts-nivo/AdsPerfomance";
import UsersByState from "../Chart/charts-nivo/UsersByState";
import ClicksViewsMonthly from "../Chart/charts-nivo/ClicksViewsMonthly";
import FavoriteBrandDistribution from "../Chart/charts-nivo/FavoriteBrandDistribution"
import FavoriteHobbyDistribution from "../Chart/charts-nivo/FavoriteHobbyDistribution";
import FavoriteSocialMediaDistribution from "../Chart/charts-nivo/FavoriteSocialMediaDistribution";
import AgeRangeDistribution from "../Chart/charts-nivo/AgeRangeDistribution";
export default function Principal() {
  const mock = {
    anunciosAtivos: 3,
    visualizacoes: 1240,
    cliques: 305,
    saldo: 72.5,
    ultimaAtividade: "29/06/2025 às 14:22",
  };

  return (
    <div
      className="space-y-8"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.22), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(34,211,238,0.18), transparent 60%)",
      }}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Anúncios Ativos", value: mock.anunciosAtivos },
          { label: "Visualizações", value: mock.visualizacoes },
          { label: "Cliques", value: mock.cliques },
          { label: "Saldo", value: `R$ ${mock.saldo.toFixed(2)}` },
        ].map((it) => (
          <div
            key={it.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl"
          >
            <p className="text-gray-400 text-sm">{it.label}</p>
            <p className="text-3xl font-bold text-white">{it.value}</p>
          </div>
        ))}
      </div>

      {/* Grids de gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartCard title="Visualizações vs Cliques" subtitle="Últimos 5 dias">
            <BarsViewsClicks />
          </ChartCard>
        </div>
        <ChartCard title="Distribuição de Anúncios" subtitle="Status atual">
          <DonutAds />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Atividade no ano" subtitle="Heatmap de visualizações">
          <CalendarActivity />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Distribuição de Usuários por Profissão" subtitle="Base mockada para teste">
          <ProfessionDistribution />
        </ChartCard>
        <ChartCard title="Desempenho por Anúncio" subtitle="Views x Cliques">
          <AdsPerformance />
        </ChartCard>
        <ChartCard title="Distribuição de Usuários por Estado" subtitle="Base mockada para validação visual">
          <UsersByState />
        </ChartCard>
        <ChartCard title="Cliques x Visualizações por Mês" subtitle="Comparativo mensal">
          <ClicksViewsMonthly />
        </ChartCard>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

  <ChartCard title="Distribuição por Marca Favorita">
    <FavoriteBrandDistribution />
  </ChartCard>

  <ChartCard title="Distribuição por Hobbies dos Usuários">
    <FavoriteHobbyDistribution />
  </ChartCard>

  <ChartCard title="Distribuição por Redes Sociais Usadas">
    <FavoriteSocialMediaDistribution />
  </ChartCard>

</div>
<ChartCard title="Distribuição por Faixa Etária">
    <AgeRangeDistribution />
  </ChartCard>
      </div>

    </div>
  );
}
