"use client";
import { ResponsiveBar } from "@nivo/bar";
import { NIVO_DARK_THEME } from "./theme";

const data = [
  { faixa: "18 - 24", usuarios: 90 },
  { faixa: "25 - 34", usuarios: 140 },
  { faixa: "35 - 44", usuarios: 115 },
  { faixa: "45 - 54", usuarios: 62 },
  { faixa: "55+", usuarios: 28 },
];

export default function AgeRangeDistribution() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveBar
        data={data}
        keys={["usuarios"]}
        indexBy="faixa"
        layout="horizontal"                // ✅ barras horizontais (formato pirâmide)
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 40, bottom: 40, left: 70 }}
        padding={0.28}
        borderRadius={6}
        colors={["#22d3ee", "#a855f7"]}     // ciano → roxo
        axisBottom={{ tickPadding: 8 }}
        axisLeft={{ tickPadding: 8 }}
        enableLabel={false}
        tooltip={({ indexValue, value }) => (
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
            <strong>{indexValue}</strong>
            <br />
            {value} usuários
          </div>
        )}
      />
    </div>
  );
}
