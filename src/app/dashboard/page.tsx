import Link from "next/link";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { Card } from "@/components/ui/Card";
import { RatioBadge } from "@/components/ui/RatioBadge";
import {
  formatCount,
  formatManYenDecimal,
  formatOkuYen,
  formatPercent,
  formatUpdatedTime,
  formatYen,
} from "@/lib/format";
import { getManagementSheet } from "@/lib/salonone/service";

const QUICK_LINKS = [
  { href: "/dashboard/kpi", icon: "📌", label: "重要指標", desc: "月別×店舗別 KPI" },
  { href: "/dashboard/stores", icon: "🏥", label: "店舗別分析", desc: "店舗ランキング" },
  { href: "/dashboard/marketing", icon: "📣", label: "WEB費用対効果", desc: "CPA / ROAS" },
  { href: "/dashboard/membership", icon: "🎯", label: "新規入会・退会率", desc: "目標60%以上" },
  { href: "/dashboard/events", icon: "📚", label: "勉強会・イベント", desc: "参加・満足度" },
  { href: "/subscription", icon: "🔁", label: "サブスク分析", desc: "MRR / 継続率" },
];

export default async function OverviewPage() {
  const data = await getManagementSheet();
  const o = data.overview;
  const latestStores = data.monthly[0].stores;

  return (
    <div className="space-y-6 p-6">
      {/* ヘッダ */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">
            <span className="rounded-full bg-brand-50 px-3 py-1">
              🩺 総合ダッシュボード
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-ink-900">
            NAORU 整体院グループ 経営サマリー
          </h1>
        </div>
        <span className="text-[11px] text-ink-400">
          最終更新: {formatUpdatedTime(o.updatedAt)}
        </span>
      </div>

      {/* ヒーローKPI */}
      <Card className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
        <Hero label="総売上（当月）" value={formatOkuYen(o.totalSales)}>
          <RatioBadge value={o.totalSalesYoY} /> <span className="text-ink-400">前年比</span>
        </Hero>
        <Hero label="店舗数" value={`${o.storeCount}店舗`}>
          <span className="text-ink-400">スタッフ {o.therapistCount}名</span>
        </Hero>
        <Hero label="カルテ枚数" value={formatCount(o.karteCount, "枚")}>
          <RatioBadge value={o.karteCountMoM} /> <span className="text-ink-400">前月比</span>
        </Hero>
        <Hero label="新規数" value={formatCount(o.newCustomers)}>
          <RatioBadge value={o.newCustomersMoM} /> <span className="text-ink-400">前月比</span>
        </Hero>
      </Card>

      {/* サブKPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard icon="🎯" iconBg="bg-emerald-500" tag="成約率" label="新規入会率" value={formatPercent(o.conversionRate)} sub="目標 60%以上" subTone={o.conversionRate >= 0.6 ? "positive" : "negative"} />
        <KpiCard icon="👤" iconBg="bg-rose-500" tag="維持率" label="退会率" value={formatPercent(o.churnRate, 1)} />
        <KpiCard icon="👥" iconBg="bg-brand-500" tag="サブスク" label="アクティブ会員" value={formatCount(o.activeMembers)} />
        <KpiCard icon="💳" iconBg="bg-sky-500" tag="MRR" label="月次経常収益" value={formatManYenDecimal(o.mrr)} sub="サブスク合計" />
      </div>

      {/* ランキング */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RankingCard
          title="店舗別 売上ランキング"
          icon="🏥"
          items={latestStores}
          by={(s) => s.sales}
          topN={7}
          primary={(s) => s.storeName}
          secondary={(s) => `スタッフ ${s.staff}名`}
          value={(s) => <span className="text-brand-600">{formatYen(s.sales)}</span>}
        />
        <RankingCard
          title="WEB費用対効果 TOP"
          icon="📣"
          items={data.marketing}
          by={(m) => m.roas}
          topN={7}
          badge="ROAS"
          primary={(m) => m.channel}
          secondary={(m) => `新規 ${m.newCustomers}名`}
          value={(m) => <span className="text-emerald-600">{m.roas.toFixed(1)}x</span>}
        />
        <RankingCard
          title="新規入会率 店舗ランキング"
          icon="🎯"
          items={data.membership}
          by={(m) => m.conversionRate}
          topN={7}
          primary={(m) => m.storeName}
          secondary={(m) => `${m.joined}/${m.newVisitors}名`}
          value={(m) => (
            <span className={m.conversionRate >= data.membershipTarget ? "text-emerald-600" : "text-rose-500"}>
              {formatPercent(m.conversionRate)}
            </span>
          )}
        />
      </div>

      {/* クイックリンク */}
      <div>
        <div className="mb-3 text-sm font-bold text-ink-500">各分析へ</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {QUICK_LINKS.map((q) => (
            <Link key={q.href} href={q.href}>
              <Card className="flex h-full flex-col gap-1 p-4 transition hover:border-brand-400 hover:shadow-md">
                <span className="text-2xl">{q.icon}</span>
                <span className="text-sm font-bold text-ink-900">{q.label}</span>
                <span className="text-xs text-ink-400">{q.desc}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-medium text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-ink-900">
        {value}
      </div>
      <div className="mt-1 flex items-center gap-1 text-xs">{children}</div>
    </div>
  );
}
