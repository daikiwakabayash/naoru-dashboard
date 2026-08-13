import clsx from "clsx";
import { formatRatio } from "@/lib/format";

/**
 * 前月対比・前年対比などの「◯◯%」バッジ。
 * 100%（=1.0）を境に、上回れば緑・下回れば赤で表示。
 */
export function RatioBadge({
  value,
  baseline = 1,
  size = "sm",
}: {
  /** 比率（1.09 = 109%） */
  value: number;
  /** 良し悪しの境界（既定 1.0 = 100%） */
  baseline?: number;
  size?: "sm" | "xs";
}) {
  const good = value >= baseline;
  const flat = Math.abs(value - baseline) < 0.005;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-md font-semibold tabular-nums",
        size === "xs" ? "px-1 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-xs",
        flat
          ? "bg-slate-100 text-ink-500"
          : good
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-500",
      )}
    >
      {!flat && <span>{good ? "▲" : "▼"}</span>}
      {formatRatio(value)}
    </span>
  );
}
