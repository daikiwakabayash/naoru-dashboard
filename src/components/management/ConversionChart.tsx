"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import type { MembershipStoreRate } from "@/lib/salonone/management-types";

export function ConversionChart({
  membership,
  target,
}: {
  membership: MembershipStoreRate[];
  target: number;
}) {
  const data = membership.map((m) => ({
    name: m.storeName,
    rate: Math.round(m.conversionRate * 100),
  }));
  const targetPct = Math.round(target * 100);

  return (
    <Card>
      <CardHeader
        title="🎯 店舗別 新規入会率"
        action={
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            目標 {targetPct}%以上
          </span>
        }
      />
      <div className="h-80 w-full p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
            <Tooltip formatter={(value: number) => [`${value}%`, "入会率"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
            <ReferenceLine y={targetPct} stroke="#10b981" strokeDasharray="4 4" label={{ value: `目標${targetPct}%`, position: "right", fontSize: 11, fill: "#10b981" }} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.rate >= targetPct ? "#10b981" : "#f87171"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
