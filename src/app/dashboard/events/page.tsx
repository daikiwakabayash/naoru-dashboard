import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { formatCount, formatPercent, formatYen } from "@/lib/format";
import { getManagementSheet } from "@/lib/salonone/service";

const TYPE_STYLE: Record<string, string> = {
  勉強会: "bg-sky-100 text-sky-700",
  イベント: "bg-brand-100 text-brand-600",
  研修: "bg-emerald-100 text-emerald-700",
  全体会議: "bg-amber-100 text-amber-700",
};

export default async function EventsPage() {
  const data = await getManagementSheet();
  const events = [...data.events].sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalParticipants = events.reduce((s, e) => s + e.participants, 0);
  const totalCost = events.reduce((s, e) => s + e.cost, 0);
  const avgSatisfaction =
    events.reduce((s, e) => s + e.satisfaction, 0) / events.length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">勉強会・イベント</h1>
        <p className="mt-1 text-sm text-ink-400">
          研修・勉強会・イベントの開催実績と参加状況
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="📚" iconBg="bg-sky-500" tag="開催" label="開催件数" value={`${events.length}件`} />
        <KpiCard icon="🙋" iconBg="bg-brand-500" tag="参加" label="延べ参加人数" value={formatCount(totalParticipants)} />
        <KpiCard icon="💰" iconBg="bg-rose-500" tag="費用" label="開催費用 合計" value={formatYen(totalCost)} />
        <KpiCard icon="⭐" iconBg="bg-amber-500" tag="評価" label="平均満足度" value={formatPercent(avgSatisfaction)} subTone="positive" />
      </div>

      <Card>
        <CardHeader title="🗓 開催実績" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-xs text-ink-400">
                <th className="px-4 py-3 text-left font-medium">開催日</th>
                <th className="px-4 py-3 text-left font-medium">種別</th>
                <th className="px-4 py-3 text-left font-medium">タイトル</th>
                <th className="px-4 py-3 text-left font-medium">対象</th>
                <th className="px-4 py-3 text-right font-medium">参加</th>
                <th className="px-4 py-3 text-right font-medium">費用</th>
                <th className="px-4 py-3 text-right font-medium">満足度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map((e) => (
                <tr key={`${e.date}-${e.title}`} className="text-ink-700">
                  <td className="px-4 py-3 tabular-nums">{e.date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${TYPE_STYLE[e.type] ?? "bg-slate-100 text-ink-500"}`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{e.title}</td>
                  <td className="px-4 py-3 text-ink-500">{e.storeName}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{e.participants}名</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatYen(e.cost)}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-600">{formatPercent(e.satisfaction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
