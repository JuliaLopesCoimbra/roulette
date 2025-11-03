"use client";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { NIVO_DARK_THEME } from "./theme";

// Tipagem opcional dos nós (color é opcional)
type BrandNode = {
  id: string;
  value?: number;
  color?: string;
  children?: BrandNode[];
};

const data: BrandNode = {
  id: "marcas",
  children: [
    { id: "Nike", value: 132, color: "#FACC15" },
    { id: "Adidas", value: 98,  color: "#22D3EE" },
    { id: "Puma", value: 64,    color: "#A855F7" },
    { id: "Under Armour", value: 41, color: "#F43F5E" },
    { id: "New Balance", value: 37, color: "#6366F1" },
    { id: "Asics", value: 26,   color: "#10B981" },
    { id: "Outra", value: 18,   color: "#E5E7EB" },
  ],
};

export default function FavoriteBrandDistribution() {
  return (
    <div className="w-full h-[310px]">
      <ResponsiveCirclePacking
        data={data}
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        // usa a cor do dataset quando existir; senão, fallback
        colors={(node) =>
          "color" in node.data && (node.data as BrandNode).color
            ? (node.data as BrandNode).color!
            : "#ffffff"
        }
        padding={4}
        leavesOnly
        enableLabels
        label={(node) => String(node.id)}
        labelTextColor="#ffffff"
        labelsSkipRadius={18}   // <-- corrigido: era labelSkipRadius
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
            <strong>{String(node.id)}</strong>
            <br />
            {String(node.value)} usuários
          </div>
        )}
      />
    </div>
  );
}
