import { Card } from "@/components/ui/Card";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-ink-900">{title}</h1>
      <Card className="flex h-64 flex-col items-center justify-center gap-2 text-center">
        <span className="text-3xl">🚧</span>
        <p className="text-sm text-ink-500">
          この画面は大枠のみです。SALON ONE 連携の実装に合わせて構築します。
        </p>
      </Card>
    </div>
  );
}
