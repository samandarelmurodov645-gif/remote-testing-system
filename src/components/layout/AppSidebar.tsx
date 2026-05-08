"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

interface AppSidebarProps {
  role: "admin" | "student";
  navItems: NavItem[];
  logoHref: string;
  logoLabel: string;
  logoLetter: string;
}

export function AppSidebar({
  role,
  navItems,
  logoHref,
  logoLabel,
  logoLetter,
}: AppSidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const logoGradient =
    role === "admin"
      ? "from-slate-500 to-slate-700"
      : "from-indigo-500 to-purple-600";

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <Link
            href={logoHref}
            className="flex items-center gap-3 group"
            onClick={() => NProgress.start()}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${logoGradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
            >
              <span className="text-white font-bold text-lg">{logoLetter}</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">{logoLabel}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = !!pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => NProgress.start()}
                className={[
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-150 group relative",
                  isActive
                    ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
                ].join(" ")}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-300 rounded-r-full" />
                )}
                <span
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                >
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-200/80 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Language + Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <LanguageSwitcher />
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/80 hover:text-red-400 transition-all group"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t("nav.logout")}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
