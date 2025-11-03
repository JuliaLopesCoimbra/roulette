"use client";
import { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import type { PointTooltipProps } from "@nivo/line";
import { NIVO_DARK_THEME } from "./theme";

// Mock de dados por mês
const mockData = {
  Janeiro: [
    { x: "01", views: 300, clicks: 50 },
    { x: "02", views: 450, clicks: 90 },
    { x: "03", views: 600, clicks: 140 },
    { x: "04", views: 800, clicks: 200 },
    { x: "05", views: 900, clicks: 260 },
  ],
  Fevereiro: [
    { x: "01", views: 120, clicks: 30 },
    { x: "02", views: 320, clicks: 60 },
    { x: "03", views: 500, clicks: 110 },
    { x: "04", views: 750, clicks: 180 },
    { x: "05", views: 820, clicks: 210 },
  ],
  Março: [
    { x: "01", views: 400, clicks: 70 },
    { x: "02", views: 600, clicks: 120 },
    { x: "03", views: 1000, clicks: 300 },
    { x: "04", views: 900, clicks: 230 },
    { x: "05", views: 1100, clicks: 310 },
  ],
} as const;

export default function ClicksViewsMonthly() {
  const [month, setMonth] = useState<keyof typeof mockData>("Janeiro");

  const formattedData = [
    {
      id: "Visualizações",
      color: "#22d3ee", // ciano
      data: mockData[month].map((item) => ({ x: item.x, y: item.views })),
    },
    {
      id: "Cliques",
      color: "#a855f7", // roxo
      data: mockData[month].map((item) => ({ x: item.x, y: item.clicks })),
    },
  ];

  // (Opcional) Deixa o TS feliz com a tipagem do tooltip
  const tooltip = ({ point }: PointTooltipProps<any>) => (
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
      <strong>{point.seriesId}</strong> <br />
      Dia: {point.data.xFormatted} <br />
      Valor: {point.data.yFormatted}
    </div>
  );

  return (
    <div className="w-full">
      {/* Select do mês */}
      <div className="flex justify-end mb-4">
        <select
          className="bg-[#0b0b0d] text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none"
          style={{ WebkitAppearance: "none", appearance: "none" }}
          value={month}
          onChange={(e) => setMonth(e.target.value as keyof typeof mockData)}
        >
          {Object.keys(mockData).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Gráfico */}
      <div className="h-[250px]">
        <ResponsiveLine
          data={formattedData}
          theme={NIVO_DARK_THEME}
          margin={{ top: 20, right: 40, bottom: 40, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisBottom={{ tickPadding: 8 }}
          axisLeft={{ tickPadding: 8 }}
          enablePoints={true}
          pointSize={10}
          useMesh={true}
          colors={(d) => (d.id === "Cliques" ? "#a855f7" : "#22d3ee")}
          tooltip={tooltip}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              translateY: 40,
              itemWidth: 120,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: "circle",
              itemTextColor: "#fff",
            },
          ]}
        />
      </div>
    </div>
  );
}
