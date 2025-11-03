"use client";
import React, { Children, cloneElement, isValidElement, ReactElement } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
  Area,
  Pie,
  Radar,
  RadialBar,
  Scatter,
} from "recharts";

type Props = { children: React.ReactNode };

// util: garante que o objeto é "mergeável"
const asObj = (v: any) => (v && typeof v === "object" ? v : {});

function applyTheme(node: React.ReactNode): React.ReactNode {
  if (!isValidElement(node)) return node;
  const el = node as ReactElement<any>;
  const type = el.type as any;
  const p = asObj(el.props);

  // defaults
  const axisDefaults = {
    tick: { fill: "var(--chart-text)" },
    axisLine: { stroke: "var(--chart-axis)" },
    tickLine: { stroke: "var(--chart-axis)" },
  };

  const gridDefaults = { stroke: "var(--chart-grid)" };

  const tooltipDefaults = {
    contentStyle: {
      background: "var(--chart-tooltip-bg)",
      border: "1px solid var(--chart-tooltip-border)",
      borderRadius: 8,
      color: "#fff",
      fontSize: 12,
    },
    labelStyle: { color: "#fff" },
    itemStyle: { color: "#fff" },
    cursor: { stroke: "var(--chart-axis)", strokeWidth: 1 },
  };

  const lineDefaults = {
    stroke: "white",
    strokeWidth: 2.5,
    type: "monotone" as const,
    dot: { r: 3, fill: "rgb(var(--theme-pink))" },
    connectNulls: false,
  };

  const barDefaults = {
    fill: "rgb(var(--theme-pink))",
    radius: [3, 3, 0, 0] as [number, number, number, number],
  };

  const areaDefaults = {
    stroke: "rgb(var(--theme-pink))",
    fill: "rgba(var(--theme-pink), 0.25)",
    strokeWidth: 2,
    type: "monotone" as const,
  };

  const pieDefaults = { label: false };
  const radarDefaults = { stroke: "rgb(var(--theme-pink))", fill: "rgba(var(--theme-pink),0.25)" };
  const radialBarDefaults = { fill: "rgb(var(--theme-pink))" };
  const scatterDefaults = { fill: "rgb(var(--theme-pink))" };

  // aplica por tipo (com cast pra evitar TS reclamar)
  if (type === XAxis) {
    return cloneElement(el, { ...axisDefaults, ...p });
  }
  if (type === YAxis) {
    return cloneElement(el, { ...axisDefaults, ...p });
  }
  if (type === CartesianGrid) {
    return cloneElement(el, { ...gridDefaults, ...p });
  }
  if (type === Tooltip) {
    const merged = {
      ...tooltipDefaults,
      ...p,
      contentStyle: { ...tooltipDefaults.contentStyle, ...asObj(p.contentStyle) },
      labelStyle: { ...tooltipDefaults.labelStyle, ...asObj(p.labelStyle) },
      itemStyle: { ...tooltipDefaults.itemStyle, ...asObj(p.itemStyle) },
      cursor: { ...tooltipDefaults.cursor, ...asObj(p.cursor) },
    };
    return cloneElement(el, merged as any);
  }
  if (type === Line) {
    return cloneElement(el, { ...lineDefaults, ...p });
  }
  if (type === Bar) {
    return cloneElement(el, { ...barDefaults, ...p });
  }
  if (type === Area) {
    return cloneElement(el, { ...areaDefaults, ...p });
  }
  if (type === Pie) {
    return cloneElement(el, { ...pieDefaults, ...p });
  }
  if (type === Radar) {
    return cloneElement(el, { ...radarDefaults, ...p });
  }
  if (type === RadialBar) {
    return cloneElement(el, { ...radialBarDefaults, ...p });
  }
  if (type === Scatter) {
    return cloneElement(el, { ...scatterDefaults, ...p });
  }

  // recursivo nos filhos
  const themedChildren = el.props?.children
    ? Children.map(el.props.children, applyTheme)
    : el.props?.children;

  return cloneElement(el, { ...el.props, children: themedChildren });
}

export default function ChartTheme({ children }: Props) {
  const themed = Children.map(children, applyTheme);
  return <>{themed}</>;
}
