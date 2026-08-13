import { KpiSheet } from "@/components/management/KpiSheet";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { formatOkuYen, formatCount, formatRatio } from "@/lib/format";
import { getManagementSheet } from "@/lib/salonone/service";

export default async function KpiPage() {
  const data = await getManagementSheet();
  const latest = data.monthly[0];
  const g = latest.group;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">重要指標</h1>
        <p className="mt-1 text-sm text-ink-400">
          月別 × 店舗別の 総売上・カルテ枚数・新規数（実績と前月対比）
        </p>
      </div>

      {/* 当月グループ集計 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="＄" iconBg="bg-emerald-500" tag={latest.monthLabel} label="総売上" value={formatOkuYen(g.sales)} sub={`前月比 ${formatRatio(g.salesMoM)}`} subTone={g.salesMoM >= 1 ? "positive" : "negative"} />
        <KpiCard icon="📈" iconBg="bg-sky-500" tag="前年比" label="総売上 前年対比" value={formatRatio(latest.salesYoY)} subTone={latest.salesYoY >= 1 ? "positive" : "negative"} />
        <KpiCard icon="📋" iconBg="bg-brand-500" tag={latest.monthLabel} label="カルテ枚数" value={formatCount(g.karte, "枚")} sub={`前月比 ${formatRatio(g.karteMoM)}`} subTone={g.karteMoM >= 1 ? "positive" : "negative"} />
        <KpiCard icon="🆕" iconBg="bg-amber-500" tag={latest.monthLabel} label="新規数" value={formatCount(g.newCount)} sub={`前月比 ${formatRatio(g.newMoM)}`} subTone={g.newMoM >= 1 ? "positive" : "negative"} />
      </div>

      <KpiSheet blocks={data.monthly} />
    </div>
  );
}
