// components/client/Chart/ChartCard.tsx
import { PropsWithChildren } from "react";

export default function ChartCard({
  title, subtitle, children,
}: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl">
      <div className="mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="h-[320px]">{children}</div>
    </div>
  );
}
