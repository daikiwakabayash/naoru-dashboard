import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RatioBadge } from "@/components/ui/RatioBadge";
import { formatCount, formatOkuYen, formatPercent, formatYen } from "@/lib/format";
import { rank } from "@/lib/salonone/ranking";
import { getManagementSheet } from "@/lib/salonone/service";

export default async function StoresPage() {
  const data = await getManagementSheet();
  const latest = data.monthly[0];
  const stores = latest.stores;

  const membershipByStore = new Map(
    data.membership.map((m) => [m.storeName, m]),
  );

  const ranked = rank(stores, { by: (s) => s.sales, direction: "desc" });
  const totalSales = stores.reduce((sum, s) => sum + s.sales, 0);
  const avgSales = totalSales / stores.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">店舗別分析</h1>
        <p className="mt-1 text-sm text-ink-400">
          {latest.monthLabel}の店舗別 売上・カルテ・新規・入会率ランキング
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="🏥" iconBg="bg-brand-500" tag="拠点" label="表示店舗数" value={`${stores.length}店舗`} sub={`グループ計 ${data.overview.storeCount}店舗`} />
        <KpiCard icon="＄" iconBg="bg-emerald-500" tag="合計" label="対象店舗 総売上" value={formatOkuYen(totalSales)} />
        <KpiCard icon="📊" iconBg="bg-sky-500" tag="平均" label="1店舗あたり売上" value={formatYen(avgSales)} />
        <KpiCard icon="👥" iconBg="bg-amber-500" tag="人員" label="スタッフ総数" value={formatCount(data.overview.therapistCount)} />
      </div>

      <Card>
        <CardHeader title="🏆 店舗ランキング（売上順）" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="text-xs text-ink-400">
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">店舗</th>
                <th className="px-4 py-3 text-right font-medium">総売上</th>
                <th className="px-3 py-3 text-center font-medium">前月比</th>
                <th className="px-4 py-3 text-right font-medium">カルテ枚数</th>
                <th className="px-4 py-3 text-right font-medium">新規数</th>
                <th className="px-4 py-3 text-right font-medium">入会率</th>
                <th className="px-4 py-3 text-right font-medium">退会率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ranked.map(({ rank: r, item }) => {
                const m = membershipByStore.get(item.storeName);
                return (
                  <tr key={item.storeName} className="text-ink-700">
                    <td className="px-4 py-3 tabular-nums text-ink-400">{r}</td>
                    <td className="px-4 py-3 font-semibold text-ink-900">{item.storeName}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink-900">{formatYen(item.sales)}</td>
                    <td className="px-3 py-3 text-center"><RatioBadge value={item.salesMoM} size="xs" /></td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.karte}枚</td>
                    <td className="px-4 py-3 text-right tabular-nums">{item.newCount}名</td>
                    <td className={clsx("px-4 py-3 text-right font-semibold tabular-nums", m && m.conversionRate >= data.membershipTarget ? "text-emerald-600" : "text-rose-500")}>
                      {m ? formatPercent(m.conversionRate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-500">
                      {m ? formatPercent(m.churnRate, 1) : "—"}
                    </td>
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
