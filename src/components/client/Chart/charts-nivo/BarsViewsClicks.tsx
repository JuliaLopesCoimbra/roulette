// components/client/Chart/BarsViewsClicks.tsx
"use client";
import { ResponsiveBar } from "@nivo/bar";
import { NIVO_DARK_THEME } from "./theme";

const data = [
  { dia: "Seg", views: 320, cliques: 80 },
  { dia: "Ter", views: 540, cliques: 120 },
  { dia: "Qua", views: 810, cliques: 210 },
  { dia: "Qui", views: 700, cliques: 160 },
  { dia: "Sex", views: 1200, cliques: 330 },
];

export default function BarsViewsClicks() {
  return (
    <ResponsiveBar
      data={data}
      keys={["views", "cliques"]}
      indexBy="dia"
      margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
      padding={0.28}
      groupMode="grouped"
      theme={NIVO_DARK_THEME}
      colors={["#22d3ee", "#a855f7"]} // ciano vs roxo
      enableLabel={false}
      axisBottom={{ tickPadding: 6 }}
      axisLeft={{ tickPadding: 6 }}
      gridYValues={5}
      borderRadius={4}
      tooltip={({ id, value, indexValue }) => (
        <div style={{ padding: 8 }}>
          <strong>{String(id)}:</strong> {value} • {indexValue}
        </div>
      )}
    />
  );
}
