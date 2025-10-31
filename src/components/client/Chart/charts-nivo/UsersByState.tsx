"use client";
import { ResponsiveBar } from "@nivo/bar";
import { NIVO_DARK_THEME } from "./theme";

// Mock — exemplo para visualização inicial
const data = [
  { estado: "SP", usuarios: 120 },
  { estado: "MG", usuarios: 85 },
  { estado: "RJ", usuarios: 75 },
  { estado: "PR", usuarios: 55 },
  { estado: "SC", usuarios: 40 },
  { estado: "BA", usuarios: 38 },
  { estado: "RS", usuarios: 34 },
];

export default function UsersByState() {
  return (
    <ResponsiveBar
      data={data}
      keys={["usuarios"]}        // nome do campo que contém os valores
      indexBy="estado"           // nome que aparece no eixo Y
      layout="horizontal"        // ✅ barras horizontais
      theme={NIVO_DARK_THEME}
      margin={{ top: 10, right: 40, bottom: 40, left: 60 }}
      padding={0.3}
      borderRadius={6}
      colors={["#a855f7"]}       // roxo principal
      axisBottom={{
        tickPadding: 8,
      }}
      axisLeft={{
        tickPadding: 8,
      }}
      enableLabel={false}
      tooltip={({ value, indexValue }) => (
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
          {value} usuários
        </div>
      )}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 60,
          itemWidth: 70,
          itemHeight: 14,
          symbolSize: 12,
          symbolShape: "circle",
          itemTextColor: "#fff",
        },
      ]}
    />
  );
}
