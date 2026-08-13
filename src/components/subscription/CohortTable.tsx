import { Card, CardHeader } from "@/components/ui/Card";
import type { CohortRow } from "@/lib/salonone/types";

/** 継続率(0-1)に応じた背景色。高いほど緑、低いほど赤のヒートマップ */
function heatStyle(value: number | null): { bg: string; text: string } {
  if (value === null) return { bg: "transparent", text: "#cbd5e1" };
  if (value >= 0.8) return { bg: "#bbf7d0", text: "#166534" };
  if (value >= 0.6) return { bg: "#dcfce7", text: "#166534" };
  if (value >= 0.4) return { bg: "#fef9c3", text: "#854d0e" };
  if (value >= 0.25) return { bg: "#fed7aa", text: "#9a3412" };
  return { bg: "#fecaca", text: "#991b1b" };
}

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) => `${i + 1}ヶ月`);

export function CohortTable({ rows }: { rows: CohortRow[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader title="📊 コホート分析（月別入会者の継続率）" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="text-xs text-ink-400">
              <th className="px-4 py-3 text-left font-medium">入会月</th>
              <th className="px-4 py-3 text-right font-medium">人数</th>
              {MONTH_LABELS.map((m) => (
                <th key={m} className="px-3 py-3 text-center font-medium">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => (
              <tr key={row.cohortMonth}>
                <td className="px-4 py-2 font-semibold text-ink-900 tabular-nums">
                  {row.cohortMonth}
                </td>
                <td className="px-4 py-2 text-right text-ink-700 tabular-nums">
                  {row.size}
                </td>
                {Array.from({ length: 12 }, (_, i) => {
                  const value = row.retention[i] ?? null;
                  const style = heatStyle(value);
                  return (
                    <td key={i} className="px-1 py-1 text-center">
                      <div
                        className="rounded-md py-1.5 text-xs font-semibold tabular-nums"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {value === null ? "" : `${Math.round(value * 100)}%`}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
