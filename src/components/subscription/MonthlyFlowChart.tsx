"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import type { MonthlyFlow } from "@/lib/salonone/types";

export function MonthlyFlowChart({ data }: { data: MonthlyFlow[] }) {
  return (
    <Card>
      <CardHeader title="👤 月別 入会・解約/停止数" />
      <div className="h-80 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}件`}
            />
            <Tooltip
              formatter={(value: number, name) => [`${value}件`, name]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              iconType="circle"
              formatter={(value) => (value === "joins" ? "入会" : "解約・停止")}
            />
            <Bar dataKey="joins" name="joins" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churns" name="churns" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
