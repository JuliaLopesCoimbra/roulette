"use client";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { NIVO_DARK_THEME } from "./theme";

const data = {
  name: "hobbies",
  children: [
    { id: "Viagens", value: 142, color: "#22D3EE" },
    { id: "Leitura", value: 109, color: "#FACC15" },
    { id: "Academia", value: 95, color: "#A855F7" },
    { id: "Jogos", value: 72, color: "#F43F5E" },
    { id: "Fotografia", value: 55, color: "#10B981" },
    { id: "Música", value: 40, color: "#6366F1" },
    { id: "Outros", value: 22, color: "#E5E7EB" },
  ],
};

type NodeData = {
  id?: string;
  value?: number;
  color?: string;
  name?: string;
  children?: NodeData[];
};

export default function FavoriteHobbyDistribution() {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveCirclePacking
        data={data}
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        padding={4}
        leavesOnly={true}
        enableLabels={true}
        label={(node) => node.id}
        labelTextColor="#ffffff"
        labelsSkipRadius={18}
        borderWidth={2}
        borderColor="rgba(255,255,255,0.25)"
        colors={(node) => {
          const n = node.data as NodeData;
          return n.color ?? "#ffffff";
        }}
        tooltip={(node) => (
          <div
            style={{
              background: "#0b0b0d",
              padding: "6px 10px",
              color: "#fff",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <strong>{node.id}</strong>
            <br />
            {node.value} usuários
          </div>
        )}
      />
    </div>
  );
}
