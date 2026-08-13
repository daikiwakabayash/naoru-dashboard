import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "NAORU 総合ダッシュボード",
  description: "整体院グループ 経営ダッシュボード（SALON ONE 連携）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 bg-slate-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
