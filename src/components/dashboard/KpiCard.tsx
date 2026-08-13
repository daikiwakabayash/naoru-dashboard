import clsx from "clsx";
import { Card } from "@/components/ui/Card";

export interface KpiCardProps {
  /** 左上のアイコン */
  icon: React.ReactNode;
  /** アイコンの背景色クラス */
  iconBg?: string;
  /** 右上のタグ（例: 合計実績, LTV, GOOGLE） */
  tag?: string;
  /** 指標ラベル（例: 総売上(個別税込)） */
  label: string;
  /** メイン値（フォーマット済み文字列） */
  value: React.ReactNode;
  /** 補足（例: 前月比 -4.33% / 9名 / 前月115名） */
  sub?: React.ReactNode;
  /** 補足の色（マイナスは赤など） */
  subTone?: "default" | "positive" | "negative";
  /** カードを強調（解約率など） */
  highlight?: boolean;
}

const SUB_TONE: Record<NonNullable<KpiCardProps["subTone"]>, string> = {
  default: "text-ink-400",
  positive: "text-emerald-600",
  negative: "text-rose-500",
};

export function KpiCard({
  icon,
  iconBg = "bg-slate-100",
  tag,
  label,
  value,
  sub,
  subTone = "default",
  highlight,
}: KpiCardProps) {
  return (
    <Card
      className={clsx(
        "relative p-5",
        highlight && "border-rose-100 bg-rose-50/40",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-xl text-white",
            iconBg,
          )}
        >
          {icon}
        </div>
        {tag && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
            {tag}
          </span>
        )}
      </div>
      <div className="mt-4 text-xs font-medium text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-ink-900">
        {value}
      </div>
      {sub && (
        <div className={clsx("mt-1 text-xs font-medium", SUB_TONE[subTone])}>
          {sub}
        </div>
      )}
    </Card>
  );
}
