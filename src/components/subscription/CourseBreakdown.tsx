import { Card, CardHeader } from "@/components/ui/Card";
import { formatManYenDecimal, formatPercent } from "@/lib/format";
import { rank } from "@/lib/salonone/ranking";
import type { CourseBreakdown as CourseBreakdownType } from "@/lib/salonone/types";

/** コース別内訳（アクティブ会員）。構成比の降順で表示 */
export function CourseBreakdown({
  courses,
  courseCount,
}: {
  courses: CourseBreakdownType[];
  courseCount: number;
}) {
  const ranked = rank(courses, { by: (c) => c.share, direction: "desc" });

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="🗂 コース別内訳（アクティブ会員）"
        action={<span className="text-xs text-ink-400">{courseCount}コース</span>}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-xs text-ink-400">
              <th className="px-5 py-3 text-left font-medium">コース名</th>
              <th className="px-5 py-3 text-right font-medium">会員数</th>
              <th className="px-5 py-3 text-right font-medium">MRR</th>
              <th className="px-5 py-3 text-right font-medium">構成比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ranked.map(({ item }) => (
              <tr key={item.courseName} className="text-ink-700">
                <td className="px-5 py-3 font-semibold text-ink-900">
                  {item.courseName}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {item.members}名
                </td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {formatManYenDecimal(item.mrr)}
                </td>
                <td className="px-5 py-3 text-right font-semibold tabular-nums">
                  {formatPercent(item.share)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
