import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RoasChart } from "@/components/management/RoasChart";
import { formatCount, formatManYenDecimal, formatYen } from "@/lib/format";
import { rank } from "@/lib/salonone/ranking";
import { getManagementSheet } from "@/lib/salonone/service";

export default async function MarketingPage() {
  const data = await getManagementSheet();
  const channels = data.marketing;

  const totalCost = channels.reduce((s, c) => s + c.cost, 0);
  const totalNew = channels.reduce((s, c) => s + c.newCustomers, 0);
  const totalSales = channels.reduce((s, c) => s + c.sales, 0);
  const avgCpa = Math.round(totalCost / totalNew);
  const totalRoas = totalSales / totalCost;

  const ranked = rank(channels, { by: (c) => c.roas, direction: "desc" });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">WEB費用対効果</h1>
        <p className="mt-1 text-sm text-ink-400">
          チャネル別の広告費・新規獲得・CPA・ROAS
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="💰" iconBg="bg-rose-500" tag="投資" label="広告費 合計" value={formatManYenDecimal(totalCost)} />
        <KpiCard icon="🆕" iconBg="bg-sky-500" tag="獲得" label="新規獲得 合計" value={formatCount(totalNew)} />
        <KpiCard icon="🎯" iconBg="bg-amber-500" tag="効率" label="平均CPA" value={formatYen(avgCpa)} sub="1名あたり獲得単価" />
        <KpiCard icon="📈" iconBg="bg-emerald-500" tag="ROAS" label="全体 費用対効果" value={`${totalRoas.toFixed(1)}x`} sub="売上 ÷ 広告費" subTone="positive" />
      </div>

      <RoasChart channels={channels} />

      <Card>
        <CardHeader title="🏆 チャネル別 内訳（ROAS順）" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-xs text-ink-400">
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">チャネル</th>
                <th className="px-4 py-3 text-right font-medium">費用</th>
                <th className="px-4 py-3 text-right font-medium">反響数</th>
                <th className="px-4 py-3 text-right font-medium">新規獲得</th>
                <th className="px-4 py-3 text-right font-medium">CPA</th>
                <th className="px-4 py-3 text-right font-medium">売上貢献</th>
                <th className="px-4 py-3 text-right font-medium">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ranked.map(({ rank: r, item }) => (
                <tr key={item.channel} className="text-ink-700">
                  <td className="px-4 py-3 tabular-nums text-ink-400">{r}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{item.channel}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatYen(item.cost)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.inquiries}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{item.newCustomers}名</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatYen(item.cpa)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-600">{formatYen(item.sales)}</td>
                  <td className={clsx("px-4 py-3 text-right font-bold tabular-nums", item.roas >= 5 ? "text-emerald-600" : item.roas >= 3 ? "text-amber-600" : "text-rose-500")}>
                    {item.roas.toFixed(1)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
