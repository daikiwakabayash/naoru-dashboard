/**
 * 順位付けユーティリティ。
 *
 * ダッシュボードの中核要件「ランキング（順位表示）」を担う共通ロジック。
 * 生産性TOP・入会率TOP10・退会率が低いスタッフ・店舗別サマリーなど、
 * すべてのランキング系UIはこの関数群で順位を算出する。
 */

export type SortDirection = "desc" | "asc";

/** 順位付け結果。元の要素に rank を付与したもの */
export interface Ranked<T> {
  rank: number;
  item: T;
  /** ランキング対象の数値 */
  value: number;
}

export interface RankOptions<T> {
  /** ランキング対象の数値を取り出す関数 */
  by: (item: T) => number;
  /**
   * 並び順。
   *   desc … 大きいほど上位（売上・入会率など）
   *   asc  … 小さいほど上位（退会率が低い＝良い、など）
   */
  direction?: SortDirection;
  /** 上位N件だけ返す（未指定なら全件） */
  topN?: number;
}

/**
 * 配列に順位を付与して返す。
 *
 * 同値は同順位（standard competition ranking = "1,2,2,4" 方式）。
 * 例: 値が [100, 90, 90, 80] → 順位 [1, 2, 2, 4]
 */
export function rank<T>(items: readonly T[], options: RankOptions<T>): Ranked<T>[] {
  const { by, direction = "desc", topN } = options;

  const sorted = [...items].sort((a, b) => {
    const diff = by(a) - by(b);
    return direction === "desc" ? -diff : diff;
  });

  const ranked: Ranked<T>[] = [];
  let previousValue: number | null = null;
  let currentRank = 0;

  sorted.forEach((item, index) => {
    const value = by(item);
    if (previousValue === null || value !== previousValue) {
      // 同値でなければ「これまでの件数 + 1」を順位にする（同順位の後は飛ぶ）
      currentRank = index + 1;
      previousValue = value;
    }
    ranked.push({ rank: currentRank, item, value });
  });

  return typeof topN === "number" ? ranked.slice(0, topN) : ranked;
}

/** メダル表示に使う色（1〜3位）。4位以降は null */
export function medalColor(rank: number): "gold" | "silver" | "bronze" | null {
  switch (rank) {
    case 1:
      return "gold";
    case 2:
      return "silver";
    case 3:
      return "bronze";
    default:
      return null;
  }
}
