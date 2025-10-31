"use client";
import { ResponsivePie } from "@nivo/pie";
import { NIVO_DARK_THEME } from "./theme";

// Mock de distribuição (nomes podem ser trocados)
const data = [
  { id: "Empreendedores", value: 38 },
  { id: "Profissionais de Marketing", value: 22 },
  { id: "Autônomos", value: 17 },
  { id: "E-commerce", value: 14 },
  { id: "Outros", value: 9 },
];

export default function ProfessionDistribution() {
  return (
    <ResponsivePie
      data={data}
      innerRadius={0.6} // donut
      padAngle={2}
      cornerRadius={4}
      sortByValue={true}
      activeOuterRadiusOffset={8}
      theme={NIVO_DARK_THEME}
      margin={{ top: 20, right: 80, bottom: 60, left: 80 }}
      colors={["#60a5fa", "#22d3ee", "#a855f7", "#f472b6", "#eab308"]} // azul/ciano/roxo/rosa/amarelo
      enableArcLabels={false}
      arcLinkLabelsTextColor="#fff"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateY: 40,
          itemWidth: 120,
          itemHeight: 20,
          itemTextColor: "#ffffff",
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
      tooltip={({ datum }) => (
        <div className="px-3 py-2 rounded-lg text-sm"
          style={{
            background: "#0b0b0d",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)"
          }}
        >
          <strong>{datum.id}</strong>: {datum.value} usuários
        </div>
      )}
    />
  );
}
