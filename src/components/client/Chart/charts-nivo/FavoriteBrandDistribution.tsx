"use client";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { NIVO_DARK_THEME } from "./theme";

const data = {
  name: "marcas",
  children: [
    { id: "Nike", value: 132, color: "#FACC15" },       // amarelo
    { id: "Adidas", value: 98, color: "#22D3EE" },     // ciano
    { id: "Puma", value: 64, color: "#A855F7" },       // roxo
    { id: "Under Armour", value: 41, color: "#F43F5E" }, // rosa avermelhado
    { id: "New Balance", value: 37, color: "#6366F1" }, // azul arroxeado
    { id: "Asics", value: 26, color: "#10B981" },      // verde
    { id: "Outra", value: 18, color: "#E5E7EB" },      // cinza claro
  ],
};

export default function FavoriteBrandDistribution() {
  return (
    <div className="w-full h-[310px]">
      <ResponsiveCirclePacking
        data={data}
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        // ✅ cada marca usa sua própria cor do dataset
        colors={(node) => (node.data.color ? node.data.color : "#ffffff")}
        padding={4}
        leavesOnly={true}
        enableLabels={true}
        label={(node) => node.id}      // ⬅ mostra o nome dentro da bolha
        labelTextColor="#ffffff"
        labelSkipRadius={18}           // ⬅ só mostra texto em bolhas grandes (evita poluir)
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
