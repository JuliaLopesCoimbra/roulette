export const NIVO_DARK_THEME = {
  background: "transparent",
  textColor: "#ffffff", // ✅ textos padrões
  fontSize: 12,

  axis: {
    domain: { line: { stroke: "rgba(255,255,255,0.25)" } },
    ticks: {
      line: { stroke: "rgba(255,255,255,0.25)" },
      text: {
        fill: "#ffffff", // ✅ textos dos gráficos (barra / linha)
      },
    },
    legend: { text: { fill: "#ffffff" } },
  },

  grid: {
    line: { stroke: "rgba(255,255,255,0.10)" },
  },

  legends: {
    text: {
      fill: "#ffffff", // ✅ legenda em branco
    },
  },

  labels: {
    text: {
      fill: "#ffffff", // ✅ textos do Calendar (meses e dias da semana)
    },
  },

  tooltip: {
    container: {
      background: "#0b0b0d",
      color: "#ffffff",
      padding: 10,
      borderRadius: 8,
    },
  },
};
