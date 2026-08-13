import clsx from "clsx";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatCount, formatYen } from "@/lib/format";
import type { BenefitItem } from "@/lib/salonone/types";

export function BenefitsCard({
  items,
  code,
}: {
  items: BenefitItem[];
  code: string;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="🎁 福利厚生・手当支給状況"
        action={
          <span className="rounded-md bg-ink-900 px-2 py-0.5 text-[11px] font-semibold text-white">
            {code}
          </span>
        }
      />
      <ul className="max-h-[420px] divide-y divide-slate-50 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between px-5 py-3"
          >
            <div>
              <div className="text-sm font-semibold text-ink-900">
                {item.name}
              </div>
              <div className="mt-0.5 text-xs text-ink-400">
                {formatCount(item.count)} ・ {formatYen(item.amount)}
              </div>
            </div>
            <span
              className={clsx(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                item.granted
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-ink-400",
              )}
            >
              {item.granted ? "✓" : "–"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
