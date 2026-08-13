import { Card } from "@/components/ui/Card";

interface FilterBarProps {
  startDate: string;
  endDate: string;
  storeLabel: string;
  updatedAt: string;
}

/**
 * 経営指標ヘッダの絞り込みバー（期間・店舗・スタッフ・SYNC）。
 *
 * 現状は表示のみ。実データ連携時は各 select を onChange で
 * DashboardFilters に反映し、サーバーへ再問い合わせする。
 */
export function FilterBar({
  startDate,
  endDate,
  storeLabel,
  updatedAt,
}: FilterBarProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-end gap-4">
        <Field label="開始日">
          <FakeInput value={startDate} icon="📅" />
        </Field>
        <Field label="終了日">
          <FakeInput value={endDate} icon="📅" />
        </Field>
        <Field label="店舗選択">
          <FakeSelect value={storeLabel} />
        </Field>
        <Field label="オーナー管理店舗">
          <FakeSelect value="オーナーを選択" muted />
        </Field>
        <Field label="スタッフ選択">
          <FakeSelect value="全スタッフ" />
        </Field>
        <Field label="クイック検索">
          <FakeInput value="" placeholder="スタッフ名・店舗名…" icon="🔍" />
        </Field>

        <div className="ml-auto flex flex-col items-end gap-1">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-bold text-white"
          >
            🔄 SYNC
          </button>
          <span className="text-[11px] text-ink-400">
            最終更新: {updatedAt}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-ink-400">{label}</span>
      {children}
    </label>
  );
}

function FakeInput({
  value,
  placeholder,
  icon,
}: {
  value: string;
  placeholder?: string;
  icon?: string;
}) {
  return (
    <div className="flex h-9 min-w-[150px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-ink-700">
      {icon && <span className="text-xs">{icon}</span>}
      <span className={value ? "" : "text-ink-400"}>
        {value || placeholder}
      </span>
    </div>
  );
}

function FakeSelect({ value, muted }: { value: string; muted?: boolean }) {
  return (
    <div className="flex h-9 min-w-[150px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm">
      <span className={muted ? "text-ink-400" : "text-ink-700"}>{value}</span>
      <span className="text-ink-400">▾</span>
    </div>
  );
}
