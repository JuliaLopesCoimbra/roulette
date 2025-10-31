"use client";
import { ResponsiveBar } from "@nivo/bar";
import { NIVO_DARK_THEME } from "./theme";

// 🔹 Dados mockados (pode substituir depois com API real)
const data = [
  {
    anuncio: "República Dominicana",
    views: 2800,
    clicks: 420,
  },
  {
    anuncio: "Curso Inglês Online",
    views: 1900,
    clicks: 310,
  },
  {
    anuncio: "Aprenda a falar Inglês",
    views: 2500,
    clicks: 390,
  },
];

export default function AdsPerformance() {
  return (
    <ResponsiveBar
      data={data}
      keys={["views", "clicks"]} // 🔹 duas barras por item
      indexBy="anuncio"
      theme={NIVO_DARK_THEME}
      margin={{ top: 20, right: 40, bottom: 70, left: 60 }}
      padding={0.28}
      groupMode="grouped"
      borderRadius={6}
      colors={["#22d3ee", "#a855f7"]} // 🔹 ciano = views / roxo = clicks
      axisBottom={{
        tickRotation: -20,
        tickPadding: 8,
      }}
      axisLeft={{
        tickPadding: 6,
      }}
      enableLabel={false}
      tooltip={({ id, value, indexValue }) => (
        <div
          style={{
            background: "#0b0b0d",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "white",
            fontSize: "14px",
          }}
        >
          <strong>{indexValue}</strong> <br />
          {id === "views" ? "Visualizações" : "Cliques"}: {value}
        </div>
      )}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateY: 60,
          itemWidth: 120,
          itemHeight: 20,
          symbolSize: 14,
          symbolShape: "circle",
          itemTextColor: "#fff",
        },
      ]}
    />
  );
}
