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

  const logoColor =
    role === "admin"
      ? "bg-slate-700"
      : "bg-gradient-to-br from-indigo-500 to-purple-600";

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <Link
            href={logoHref}
            className="flex items-center gap-3 group"
            onClick={() => NProgress.start()}
          >
            <div
              className={`w-10 h-10 rounded-xl ${logoColor} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform`}
            >
              <span className="text-white font-bold text-xl">{logoLetter}</span>
            </div>
            <span className="text-white font-bold text-xl">{logoLabel}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = !!pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => NProgress.start()}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                  "transition-all duration-150 group",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                <span
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}
                >
                  {item.icon}
                </span>
                <span>{t(item.labelKey)}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Language + Logout */}
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <LanguageSwitcher />
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            >
              <svg
                className="w-4 h-4"
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
