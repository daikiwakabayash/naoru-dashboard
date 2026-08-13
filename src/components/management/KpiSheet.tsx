"use client";

import { useState } from "react";
import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { RatioBadge } from "@/components/ui/RatioBadge";
import { formatYen } from "@/lib/format";
import type { MonthlyKpiBlock, StoreMonthlyKpi } from "@/lib/salonone/management-types";

/**
 * 重要指標シート（月別 × 店舗別）。
 * 総売上 / カルテ枚数 / 新規数 を、実績＋前月対比で店舗ごとに表示。
 * スプレッドシート「全体管理シート」の構造を踏襲。
 */
export function KpiSheet({ blocks }: { blocks: MonthlyKpiBlock[] }) {
  const [index, setIndex] = useState(0);
  const block = blocks[index];

  return (
    <Card>
      <CardHeader
        title="📌 重要指標（月別 × 店舗別）"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-400">前年対比</span>
            <RatioBadge value={block.salesYoY} />
          </div>
        }
      />

      {/* 月タブ */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-4 py-2">
        {blocks.map((b, i) => (
          <button
            key={b.monthLabel}
            type="button"
            onClick={() => setIndex(i)}
            className={clsx(
              "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
              i === index
                ? "bg-brand-500 text-white"
                : "text-ink-500 hover:bg-slate-100",
            )}
          >
            {b.monthLabel}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="text-xs text-ink-400">
              <th className="px-4 py-3 text-left font-medium">店舗</th>
              <th className="px-4 py-3 text-right font-medium">人数</th>
              <th className="px-4 py-3 text-right font-medium">総売上</th>
              <th className="px-3 py-3 text-center font-medium">前月比</th>
              <th className="px-4 py-3 text-right font-medium">カルテ枚数</th>
              <th className="px-3 py-3 text-center font-medium">前月比</th>
              <th className="px-4 py-3 text-right font-medium">新規数</th>
              <th className="px-3 py-3 text-center font-medium">前月比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <KpiRow row={block.group} highlight />
            {block.stores.map((s) => (
              <KpiRow key={s.storeName} row={s} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function KpiRow({ row, highlight }: { row: StoreMonthlyKpi; highlight?: boolean }) {
  return (
    <tr className={clsx(highlight ? "bg-slate-50 font-semibold" : "text-ink-700")}>
      <td className="px-4 py-3 font-semibold text-ink-900">{row.storeName}</td>
      <td className="px-4 py-3 text-right tabular-nums text-ink-500">
        {row.staff}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-ink-900">
        {formatYen(row.sales)}
      </td>
      <td className="px-3 py-3 text-center">
        <RatioBadge value={row.salesMoM} size="xs" />
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{row.karte}枚</td>
      <td className="px-3 py-3 text-center">
        <RatioBadge value={row.karteMoM} size="xs" />
      </td>
      <td className="px-4 py-3 text-right tabular-nums">{row.newCount}名</td>
      <td className="px-3 py-3 text-center">
        <RatioBadge value={row.newMoM} size="xs" />
      </td>
    </tr>
  );
}
