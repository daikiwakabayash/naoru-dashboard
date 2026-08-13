import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { formatPercent } from "@/lib/format";
import type { RetentionAnalysis } from "@/lib/salonone/types";

export function RetentionCards({ data }: { data: RetentionAnalysis }) {
  const items: {
    label: string;
    value: string;
    highlight?: boolean;
  }[] = [
    { label: "月間解約率", value: formatPercent(data.monthlyChurnRate, 2), highlight: true },
    { label: "初月解約率", value: formatPercent(data.firstMonthChurnRate, 0), highlight: true },
    {
      label: "3ヶ月以内解約率",
      value: data.within3MonthChurnRate === null ? "-" : formatPercent(data.within3MonthChurnRate, 2),
    },
    { label: "3ヶ月継続率", value: formatPercent(data.retention3Month, 0) },
    { label: "6ヶ月継続率", value: formatPercent(data.retention6Month, 0) },
    { label: "12ヶ月継続率", value: formatPercent(data.retention12Month, 0) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <Card
          key={item.label}
          className={clsx(
            "p-4",
            item.highlight && "border-rose-100 bg-rose-50/50",
          )}
        >
          <div className="text-[11px] font-medium text-ink-400">
            {item.label}
          </div>
          <div
            className={clsx(
              "mt-2 text-2xl font-bold tabular-nums",
              item.highlight ? "text-rose-500" : "text-ink-900",
            )}
          >
            {item.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
