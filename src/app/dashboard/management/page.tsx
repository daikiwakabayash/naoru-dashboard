import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RankingCard } from "@/components/dashboard/RankingCard";
import { BenefitsCard } from "@/components/dashboard/BenefitsCard";
import {
  formatCount,
  formatManYen,
  formatPercent,
  formatUpdatedTime,
  formatYen,
} from "@/lib/format";
import { getManagementDashboard } from "@/lib/salonone/service";
import type { DashboardFilters } from "@/lib/salonone/types";

const DEFAULT_FILTERS: DashboardFilters = {
  startDate: "2026-06-30",
  endDate: "2026-07-30",
};

export default async function ManagementPage() {
  const data = await getManagementDashboard(DEFAULT_FILTERS);
  const { kpis } = data;

  return (
    <div className="space-y-5 p-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">
          <span className="rounded-full bg-brand-50 px-3 py-1">
            📈 Analytics Dashboard
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-ink-900">経営指標</h1>
        <p className="mt-1 text-sm text-ink-400">
          スタッフ別の生産性・入会率・退会率ランキングと福利厚生の支給状況
        </p>
      </div>

      <FilterBar
        startDate="2026年6月30日"
        endDate="2026年7月30日"
        storeLabel="大森 他91件"
        updatedAt={formatUpdatedTime(data.updatedAt)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon="＄" iconBg="bg-emerald-500" tag="合計実績" label="総売上(個別税込)" value={formatYen(kpis.totalSales)} />
        <KpiCard icon="📈" iconBg="bg-sky-500" tag="新規獲得" label="新規売上" value={formatYen(kpis.newSales)} />
        <KpiCard icon="🔁" iconBg="bg-brand-500" tag="LTV" label="継続売上" value={formatYen(kpis.recurringSales)} />
        <KpiCard icon="％" iconBg="bg-rose-500" tag="維持率" label="退会率" value={formatPercent(kpis.churnRate)} />
        <KpiCard icon="👥" iconBg="bg-sky-500" tag="集客数" label="総新規数" value={formatCount(kpis.newCustomers)} />
        <KpiCard icon="🎯" iconBg="bg-emerald-500" tag="成約率" label="入会率" value={`${formatPercent(kpis.conversionRate)} (${formatCount(kpis.conversionCount)})`} />
        <KpiCard icon="💬" iconBg="bg-slate-700" tag="Google" label="G口コミ(合計)" value={formatCount(kpis.googleReviews, "件")} />
        <KpiCard icon="❤️" iconBg="bg-pink-500" tag="Hotpepper" label="H口コミ(合計)" value={formatCount(kpis.hotpepperReviews, "件")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <RankingCard
          title="生産性 (売上)"
          icon="＄"
          items={data.productivity}
          by={(s) => s.sales}
          primary={(s) => s.staffName}
          secondary={(s) => s.storeName}
          value={(s) => <span className="text-brand-600">{formatManYen(s.sales)}</span>}
        />
        <RankingCard
          title="入会率 TOP10"
          icon="🎯"
          items={data.conversion}
          by={(s) => s.conversionRate}
          topN={10}
          badge="TOP10"
          primary={(s) => s.staffName}
          secondary={(s) => s.storeName}
          value={(s) => (
            <span>
              {formatPercent(s.conversionRate)}{" "}
              <span className="text-xs font-normal text-ink-400">({s.conversionCount}名)</span>
            </span>
          )}
        />
        <RankingCard
          title="退会率が低いスタッフ"
          icon="🛡️"
          items={data.churn}
          by={(s) => s.churnRate}
          direction="asc"
          primary={(s) => s.staffName}
          secondary={(s) => s.storeName}
          value={(s) => <span className="text-emerald-600">{formatPercent(s.churnRate)}</span>}
        />
        <BenefitsCard items={data.benefits} code={data.benefitsCode} />
      </div>
    </div>
  );
}
