// components/client/Chart/DonutAds.tsx
"use client";
import { ResponsivePie } from "@nivo/pie";
import { NIVO_DARK_THEME } from "./theme";

const data = [
  { id: "Ativos", value: 3 },
  { id: "Pausados", value: 1 },
  { id: "Reprovados", value: 0 },
];

export default function DonutAds() {
  return (
    <ResponsivePie
      data={data}
      innerRadius={0.6}
      padAngle={1.5}
      cornerRadius={4}
      theme={NIVO_DARK_THEME}
      colors={["#10b981", "#f59e0b", "#ef4444"]} // verde / ambar / vermelho
      enableArcLabels={false}
      enableArcLinkLabels={false}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          itemWidth: 100,
          itemHeight: 14,
          translateY: 16,
          symbolSize: 10,
          symbolShape: "circle",
        },
      ]}
      tooltip={({ datum }) => (
        <div style={{ padding: 8 }}>
          <strong>{datum.id}</strong>: {datum.value}
        </div>
      )}
    />
  );
}
