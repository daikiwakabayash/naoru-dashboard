import { Card, CardHeader } from "@/components/ui/Card";
import { RankBadge } from "@/components/ui/RankBadge";
import { rank, type SortDirection } from "@/lib/salonone/ranking";

export interface RankingCardProps<T> {
  /** カード見出し（例: 生産性 (売上)） */
  title: React.ReactNode;
  icon?: React.ReactNode;
  /** ランキング対象データ */
  items: readonly T[];
  /** ランキングに使う数値 */
  by: (item: T) => number;
  /** desc = 大きいほど上位 / asc = 小さいほど上位（退会率など） */
  direction?: SortDirection;
  /** 上位N件 */
  topN?: number;
  /** 主表示名（例: スタッフ名） */
  primary: (item: T) => React.ReactNode;
  /** 補助表示（例: 店舗名） */
  secondary?: (item: T) => React.ReactNode;
  /** 右側に出す値（例: ¥191万、81% (11件)） */
  value: (item: T) => React.ReactNode;
  /** 右上の付加ラベル（例: TOP10） */
  badge?: React.ReactNode;
}

/**
 * 汎用ランキングカード。
 *
 * 生産性・入会率・退会率など、すべての「順位付き一覧」をこの1コンポーネントで描画する。
 * 順位は ranking.ts の rank() が算出（同値は同順位）。
 */
export function RankingCard<T>({
  title,
  icon,
  items,
  by,
  direction = "desc",
  topN,
  primary,
  secondary,
  value,
  badge,
}: RankingCardProps<T>) {
  const ranked = rank(items, { by, direction, topN });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        icon={icon}
        title={title}
        action={
          badge ? (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
              {badge}
            </span>
          ) : (
            <span className="text-amber-400">🏆</span>
          )
        }
      />
      <ol className="divide-y divide-slate-50">
        {ranked.map(({ rank: r, item }, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-5 py-3 text-sm"
          >
            <RankBadge rank={r} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-ink-900">
                {primary(item)}
              </div>
              {secondary && (
                <div className="truncate text-xs text-ink-400">
                  {secondary(item)}
                </div>
              )}
            </div>
            <div className="shrink-0 text-right font-bold tabular-nums text-ink-900">
              {value(item)}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
