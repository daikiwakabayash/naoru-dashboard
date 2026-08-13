import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatManYenDecimal, formatPercent, formatYen } from "@/lib/format";
import { rank } from "@/lib/salonone/ranking";
import type { StoreSummary } from "@/lib/salonone/types";

/**
 * 店舗別サマリー（ランキング表）。
 * MRR 昇順で順位付け（デザインの ▲ に合わせる）。解約率は高いほど赤で強調。
 */
export function StoreSummaryTable({
  stores,
  storeCount,
}: {
  stores: StoreSummary[];
  storeCount: number;
}) {
  const ranked = rank(stores, { by: (s) => s.mrr, direction: "asc" });

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="📍 店舗別サマリー"
        action={
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400">{storeCount}店舗</span>
            <span className="rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-bold text-white">
              ⬇ CSV
            </span>
          </div>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-xs text-ink-400">
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">店舗</th>
              <th className="px-4 py-3 text-right font-medium">総売上高</th>
              <th className="px-4 py-3 text-right font-medium">会員数</th>
              <th className="px-4 py-3 text-right font-medium">MRR ▲</th>
              <th className="px-4 py-3 text-right font-medium">ARPU</th>
              <th className="px-4 py-3 text-right font-medium">解約率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ranked.map(({ rank: r, item }) => (
              <tr key={item.storeId} className="text-ink-700">
                <td className="px-4 py-3 text-ink-400 tabular-nums">{r}</td>
                <td className="px-4 py-3 font-semibold text-ink-900">
                  {item.storeName}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-600">
                  {formatManYenDecimal(item.grossSales)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {item.members}名
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatManYenDecimal(item.mrr)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatYen(item.arpu)}
                </td>
                <td
                  className={clsx(
                    "px-4 py-3 text-right font-bold tabular-nums",
                    item.churnRate >= 0.1
                      ? "text-rose-500"
                      : item.churnRate === 0
                        ? "text-ink-900"
                        : "text-ink-700",
                  )}
                >
                  {formatPercent(item.churnRate, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
