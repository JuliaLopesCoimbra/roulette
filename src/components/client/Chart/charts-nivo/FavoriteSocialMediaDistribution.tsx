"use client";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { NIVO_DARK_THEME } from "./theme";

const data = {
  name: "redes",
  children: [
    { id: "Instagram", value: 210, color: "#E1306C" },   // rosa instagram
    { id: "TikTok", value: 180, color: "#010101" },      // preto tiktok
    { id: "WhatsApp", value: 165, color: "#25D366" },    // verde whatsapp
    { id: "Facebook", value: 140, color: "#1877F2" },    // azul facebook
    { id: "LinkedIn", value: 82, color: "#0A66C2" },     // azul linkedin
    { id: "YouTube", value: 64, color: "#FF0000" },      // vermelho youtube
    { id: "Outros", value: 28, color: "#A855F7" },       // roxo padrão do dashboard
  ],
};

type NodeData = {
  id?: string;
  value?: number;
  color?: string;
  name?: string;
  children?: NodeData[];
};

export default function FavoriteSocialMediaDistribution() {
  return (
    <div className="w-full h-[360px]">
      <ResponsiveCirclePacking
        data={data}
        theme={NIVO_DARK_THEME}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        colors={(node) => (node.data as NodeData).color ?? "#ffffff"}
        padding={4}
        leavesOnly
        enableLabels
        label={(node) => node.id as string}
        labelTextColor="#ffffff"
        labelsSkipRadius={18}
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
            {node.value} usuários
          </div>
        )}
      />
    </div>
  );
}
