"use client";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { NIVO_DARK_THEME } from "./theme";

const data = {
  name: "hobbies",
  children: [
    { id: "Viagens", value: 142, color: "#22D3EE" },      // ciano
    { id: "Leitura", value: 109, color: "#FACC15" },      // amarelo
    { id: "Academia", value: 95, color: "#A855F7" },      // roxo
    { id: "Jogos", value: 72, color: "#F43F5E" },         // rosado
    { id: "Fotografia", value: 55, color: "#10B981" },    // verde
    { id: "Música", value: 40, color: "#6366F1" },        // azul
    { id: "Outros", value: 22, color: "#E5E7EB" },        // cinza
  ],
};

export default function FavoriteHobbyDistribution() {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveCirclePacking
        data={data}
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        colors={(node) => (node.data.color ? node.data.color : "#ffffff")}
        padding={4}
        leavesOnly={true}
        enableLabels={true}
        label={(node) => node.id}
        labelTextColor="#ffffff"
        labelSkipRadius={18}
        borderWidth={2}
        borderColor="rgba(255,255,255,0.25)"
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
