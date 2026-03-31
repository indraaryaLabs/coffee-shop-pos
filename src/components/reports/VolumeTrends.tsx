"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { weeklyRevenue } from "@/lib/data/transactions";
import { useTheme } from "next-themes";

export function VolumeTrends() {
  const [metric, setMetric] = useState<"hourly" | "daily">("daily");
  const { resolvedTheme } = useTheme();

  // Find max value to color it differently
  const maxValue = Math.max(...weeklyRevenue.map((d) => d.orders));

  const baseColor = resolvedTheme === "dark" ? "#8C5A3C" : "#D9C5B2";
  const hoverColor = resolvedTheme === "dark" ? "#C08552" : "#8C5A3C";
  const maxColor = resolvedTheme === "dark" ? "#FEBB84" : "#4B2E2B";

  return (
    <div className="bg-card rounded-[2rem] p-8 h-full flex flex-col shadow-sm border border-border">
      <div className="flex items-center justify-between mb-8">
        <h4 className="font-headline text-xl font-bold text-foreground">
          Volume Trends
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => setMetric("hourly")}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
              metric === "hourly"
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setMetric("daily")}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
              metric === "daily"
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={160}>
          <BarChart data={weeklyRevenue} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold", opacity: 0.4 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border px-3 py-2 rounded-lg shadow-lg">
                      <p className="font-bold text-sm text-foreground">
                        {payload[0].payload.day}
                      </p>
                      <p className="text-primary font-headline font-bold">
                        {`${payload[0].value} Orders`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="orders" radius={[12, 12, 0, 0]} animationDuration={1000}>
              {weeklyRevenue.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.orders === maxValue ? maxColor : baseColor}
                  className="hover:fill-[var(--chart-hover)] transition-all cursor-pointer duration-300"
                  style={{ "--chart-hover": hoverColor } as React.CSSProperties}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
