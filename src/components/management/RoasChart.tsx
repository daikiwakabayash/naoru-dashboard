"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import type { MarketingChannel } from "@/lib/salonone/management-types";

export function RoasChart({ channels }: { channels: MarketingChannel[] }) {
  const data = [...channels]
    .sort((a, b) => b.roas - a.roas)
    .map((c) => ({ name: c.channel, roas: Number(c.roas.toFixed(1)) }));

  return (
    <Card>
      <CardHeader title="📊 チャネル別 ROAS（費用対効果）" />
      <div className="h-80 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 40, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}x`} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => [`${value}x`, "ROAS"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            <Bar dataKey="roas" radius={[0, 4, 4, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.roas >= 5 ? "#10b981" : d.roas >= 3 ? "#f59e0b" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
