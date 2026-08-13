import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ConversionChart } from "@/components/management/ConversionChart";
import { formatCount, formatPercent } from "@/lib/format";
import { rank } from "@/lib/salonone/ranking";
import { getManagementSheet } from "@/lib/salonone/service";

export default async function MembershipPage() {
  const data = await getManagementSheet();
  const rows = data.membership;
  const target = data.membershipTarget;

  const totalVisitors = rows.reduce((s, m) => s + m.newVisitors, 0);
  const totalJoined = rows.reduce((s, m) => s + m.joined, 0);
  const totalChurned = rows.reduce((s, m) => s + m.churned, 0);
  const overallRate = totalJoined / totalVisitors;
  const achieved = rows.filter((m) => m.conversionRate >= target).length;

  const ranked = rank(rows, { by: (m) => m.conversionRate, direction: "desc" });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">新規入会・退会率</h1>
        <p className="mt-1 text-sm text-ink-400">
          店舗別の新規入会率（目標60%以上）と退会率
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="🎯" iconBg="bg-emerald-500" tag="成約率" label="全体 入会率" value={formatPercent(overallRate)} sub={`目標 ${formatPercent(target)}以上`} subTone={overallRate >= target ? "positive" : "negative"} />
        <KpiCard icon="✅" iconBg="bg-sky-500" tag="達成" label="目標達成店舗" value={`${achieved}/${rows.length}店舗`} />
        <KpiCard icon="🆕" iconBg="bg-brand-500" tag="集客" label="新規来院 → 入会" value={`${formatCount(totalVisitors)} → ${formatCount(totalJoined)}`} />
        <KpiCard icon="👤" iconBg="bg-rose-500" tag="維持" label="退会者数" value={formatCount(totalChurned)} />
      </div>

      <ConversionChart membership={rows} target={target} />

      <Card>
        <CardHeader title="🏆 店舗別 入会率ランキング" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="text-xs text-ink-400">
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">店舗</th>
                <th className="px-4 py-3 text-right font-medium">新規来院</th>
                <th className="px-4 py-3 text-right font-medium">入会</th>
                <th className="px-4 py-3 text-right font-medium">入会率</th>
                <th className="px-4 py-3 text-center font-medium">目標60%</th>
                <th className="px-4 py-3 text-right font-medium">退会率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ranked.map(({ rank: r, item }) => {
                const ok = item.conversionRate >= target;
                return (
                  <tr key={item.storeName} className="text-ink-700">
                    <td className="px-4 py-3 tabular-nums text-ink-400">{r}</td>
                    <td className="px-4 py-3 font-semibold text-ink-900">{item.storeName}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.newVisitors}名</td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.joined}名</td>
                    <td className={clsx("px-4 py-3 text-right font-bold tabular-nums", ok ? "text-emerald-600" : "text-rose-500")}>
                      {formatPercent(item.conversionRate)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={clsx("inline-flex h-5 w-5 items-center justify-center rounded-full text-xs", ok ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500")}>
                        {ok ? "✓" : "!"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-500">{formatPercent(item.churnRate, 1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
