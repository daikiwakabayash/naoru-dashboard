import clsx from "clsx";
import { medalColor } from "@/lib/salonone/ranking";

const MEDAL_CLASSES: Record<string, string> = {
  gold: "bg-amber-400 text-white",
  silver: "bg-slate-300 text-white",
  bronze: "bg-amber-600 text-white",
};

/** ランキングの順位バッジ。1〜3位はメダル色、それ以降はグレー */
export function RankBadge({ rank }: { rank: number }) {
  const medal = medalColor(rank);
  return (
    <span
      className={clsx(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums",
        medal ? MEDAL_CLASSES[medal] : "bg-slate-100 text-ink-500",
      )}
    >
      {rank}
    </span>
  );
}
