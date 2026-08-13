"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatYen } from "@/lib/format";
import type {
  SubscriptionMember,
  SubscriptionStatus,
} from "@/lib/salonone/types";

interface TabDef {
  key: SubscriptionStatus;
  label: string;
  /** タブ横のカウント（KPIから算出できないものは members から数える） */
  count: number;
}

export function MembersTabs({
  members,
  counts,
}: {
  members: SubscriptionMember[];
  counts: Record<SubscriptionStatus, number>;
}) {
  const tabs: TabDef[] = useMemo(
    () => [
      { key: "active", label: "アクティブ", count: counts.active },
      { key: "new", label: "新規入会", count: counts.new },
      { key: "plan_changed", label: "プラン変更", count: counts.plan_changed },
      { key: "canceled", label: "解約済み", count: counts.canceled },
      { key: "paused", label: "一時停止", count: counts.paused },
      { key: "resumed", label: "復帰", count: counts.resumed },
      { key: "refunded", label: "払戻し", count: counts.refunded },
      { key: "expired", label: "期限超過", count: counts.expired },
    ],
    [counts],
  );

  const [active, setActive] = useState<SubscriptionStatus>("paused");
  const rows = members.filter((m) => m.status === active);

  return (
    <Card className="overflow-hidden">
      {/* タブ */}
      <div className="flex flex-wrap gap-1 border-b border-slate-100 px-4 pt-3">
        {tabs.map((tab) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={
                "flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-semibold transition " +
                (selected
                  ? "border-b-2 border-brand-500 text-brand-600"
                  : "text-ink-500 hover:text-ink-900")
              }
            >
              {tab.label}
              <span
                className={
                  "rounded-full px-1.5 text-[11px] " +
                  (selected
                    ? "bg-brand-100 text-brand-600"
                    : "bg-slate-100 text-ink-400")
                }
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-400">
              <th className="px-5 py-3 font-medium">氏名</th>
              <th className="px-5 py-3 font-medium">コース</th>
              <th className="px-5 py-3 text-center font-medium">決済回数</th>
              <th className="px-5 py-3 text-right font-medium">合計金額</th>
              <th className="px-5 py-3 font-medium">開始日</th>
              <th className="px-5 py-3 font-medium">停止日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-ink-400"
                >
                  該当する会員はいません
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={m.memberId} className="text-ink-700">
                  <td className="px-5 py-3 font-semibold text-ink-900">
                    {m.name}
                  </td>
                  <td className="px-5 py-3">{m.course}</td>
                  <td className="px-5 py-3 text-center tabular-nums">
                    {m.paymentCount}回
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {formatYen(m.totalAmount)}
                  </td>
                  <td className="px-5 py-3 tabular-nums">{m.startDate}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-brand-600">
                    {m.endDate ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 text-xs text-ink-400">
        {rows.length}件表示
      </div>
    </Card>
  );
}
