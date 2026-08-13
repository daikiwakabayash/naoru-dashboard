"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/dashboard", label: "経営指標", icon: "🏠" },
  { href: "/dashboard/overview", label: "ダッシュボード", icon: "📊" },
  { href: "/dashboard/marketing", label: "マーケティング", icon: "📣" },
  { href: "/subscription", label: "サブスク分析", icon: "🔁" },
  { href: "/dashboard/plan", label: "事業計画", icon: "🎯" },
  { href: "/dashboard/customers", label: "顧客管理", icon: "👥" },
  { href: "/dashboard/finance", label: "経理・財務", icon: "🧾" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white px-3 py-5 md:block">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="text-2xl">❤️</span>
        <span className="text-lg font-bold tracking-widest text-ink-900">
          NAORU
        </span>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-ink-500 hover:bg-slate-100 hover:text-ink-900",
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
