// components/client/Chart/CalendarActivity.tsx
"use client";
import { ResponsiveCalendar } from "@nivo/calendar";
import { NIVO_DARK_THEME } from "./theme";

const today = new Date();
const year = today.getFullYear();
const start = `${year}-01-01`;
const end = `${year}-12-31`;

// mock de valores
const values = Array.from({ length: 40 }).map(() => {
  const d = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  return {
    day: d.toISOString().slice(0, 10),
    value: Math.floor(Math.random() * 1200) + 50,
  };
});

export default function CalendarActivity() {
  return (
    <ResponsiveCalendar
      data={values}
      from={start}
      to={end}
      emptyColor="rgba(255,255,255,0.04)"
      colors={["#312e81", "#4338ca", "#7c3aed", "#a855f7"]}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      yearSpacing={40}
      monthBorderColor="rgba(255,255,255,0.1)"
      dayBorderWidth={2}
      dayBorderColor="rgba(255,255,255,0.05)"
      theme={NIVO_DARK_THEME}
      monthLegendOffset={10}
      monthLegend={(month) =>
        new Date(2000, month, 1).toLocaleString("pt-BR", { month: "short" }).toUpperCase()
      }
      dayLegendOffset={12}
      legends={[
        {
          anchor: "bottom-right",
          direction: "row",
          itemCount: 4,
          itemWidth: 34,
          itemHeight: 12,
          itemsSpacing: 6,
          translateX: -10,
          translateY: -10,
          symbolSize: 12,
        },
      ]}
    />
  );
}
