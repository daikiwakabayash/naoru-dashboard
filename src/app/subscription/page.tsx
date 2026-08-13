import { KpiCard } from "@/components/dashboard/KpiCard";
import { MembersTabs } from "@/components/subscription/MembersTabs";
import { RetentionCards } from "@/components/subscription/RetentionCards";
import { StoreSummaryTable } from "@/components/subscription/StoreSummaryTable";
import { CourseBreakdown } from "@/components/subscription/CourseBreakdown";
import { MonthlyFlowChart } from "@/components/subscription/MonthlyFlowChart";
import { CohortTable } from "@/components/subscription/CohortTable";
import {
  formatCount,
  formatManYenDecimal,
  formatPercent,
  formatSignedPercent,
  formatUpdatedTime,
  formatYen,
} from "@/lib/format";
import { getSubscriptionDashboard } from "@/lib/salonone/service";
import type { DashboardFilters } from "@/lib/salonone/types";

const DEFAULT_FILTERS: DashboardFilters = {
  startDate: "2026-07-01",
  endDate: "2026-07-31",
  month: "2026-07",
  storeId: "mitaka",
};

export default async function SubscriptionPage() {
  const data = await getSubscriptionDashboard(DEFAULT_FILTERS);
  const { kpis } = data;

  return (
    <div className="space-y-6 p-6">
      {/* ヘッダ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500 text-white">
            🔁
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">
              Subscription
            </div>
            <h1 className="text-2xl font-bold text-ink-900">サブスク分析</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HeaderSelect value="三鷹院" icon="📍" />
          <HeaderSelect value="2026年7月" />
          <button className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-bold text-white">
            🔄 SYNC
          </button>
          <span className="text-[11px] text-ink-400">
            {formatUpdatedTime(data.updatedAt)} 更新
          </span>
        </div>
      </div>

      {/* 会員 & 収益 KPI */}
      <section className="space-y-3">
        <SectionLabel>👥 会員 & 収益</SectionLabel>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          <KpiCard icon="👥" iconBg="bg-brand-500" label="アクティブ会員数" value={formatCount(kpis.activeMembers)} />
          <KpiCard
            icon="💳"
            iconBg="bg-sky-500"
            label="総MRR"
            value={formatYen(kpis.mrr)}
            sub={`前月比 ${formatSignedPercent(kpis.mrrChange)}`}
            subTone={kpis.mrrChange < 0 ? "negative" : "positive"}
          />
          <KpiCard icon="＄" iconBg="bg-cyan-500" label="ARPU" value={formatYen(kpis.arpu)} sub="サブスク決済額÷会員数" />
          <KpiCard icon="📈" iconBg="bg-emerald-500" label="総売上高" value={`¥${formatManYenDecimal(kpis.grossSales)}`} sub="Square売上合計（税込）" />
          <KpiCard icon="🔁" iconBg="bg-rose-500" label="返品" value={formatYen(kpis.refunds)} sub="返金・払戻し" />
          <KpiCard
            icon="👤"
            iconBg="bg-brand-500"
            label="解約率"
            value={formatPercent(kpis.churnRate, 2)}
            sub={`${kpis.churnedCount}名 / 前月${kpis.previousMembers}名`}
            subTone="negative"
            highlight
          />
          <KpiCard icon="＄" iconBg="bg-amber-500" label="LTV" value={`¥${formatManYenDecimal(kpis.ltv)}`} sub="顧客生涯価値" />
        </div>
      </section>

      {/* ステータス別会員タブ */}
      <MembersTabs members={data.members} counts={data.statusCounts} />

      {/* 解約・継続分析 */}
      <section className="space-y-3">
        <SectionLabel>🧑‍🤝‍🧑 解約・継続分析</SectionLabel>
        <RetentionCards data={data.retention} />
      </section>

      {/* 店舗別サマリー & コース別内訳 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StoreSummaryTable stores={data.storeSummaries} storeCount={data.storeCount} />
        <CourseBreakdown courses={data.courseBreakdown} courseCount={data.courseCount} />
      </div>

      {/* 月別入退会 */}
      <MonthlyFlowChart data={data.monthlyFlow} />

      {/* コホート */}
      <CohortTable rows={data.cohort} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-bold text-ink-500">{children}</div>
  );
}

function HeaderSelect({ value, icon }: { value: string; icon?: string }) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-700">
      {icon && <span className="text-xs">{icon}</span>}
      {value}
      <span className="text-ink-400">▾</span>
    </div>
  );
}
