"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";

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
}

export function AppSidebar({
  navItems,
  logoHref,
  logoLabel,
}: AppSidebarProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all hover:scale-105 bg-white border border-slate-200"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        style={{
          background: "#FFFFFF",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "2px 0 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top accent bar — indigo → emerald */}
        <div
          className="h-0.5 shrink-0"
          style={{
            background: "linear-gradient(90deg, #4338CA, #10B981, #4338CA)",
            backgroundSize: "200% 100%",
            animation: "gradient-shift 4s linear infinite",
          }}
        />

        {/* Logo */}
        <div className="px-5 py-5 shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Link
            href={logoHref}
            className="flex items-center gap-3 group"
            onClick={() => NProgress.start()}
          >
            <div className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(67,56,202,0.4)]">
              <Logo size={36} />
            </div>
            <span className="text-slate-800 font-bold text-lg tracking-tight">{logoLabel}</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = !!pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => NProgress.start()}
                className={[
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200 group relative",
                  mounted ? "animate-sidebar-in" : "",
                  isActive
                    ? "sidebar-active text-indigo-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                ].join(" ")}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #4338CA, #6366f1)" }}
                  />
                )}

                {/* Icon */}
                <span className={`shrink-0 transition-all duration-200 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"}`}>
                  {item.icon}
                </span>

                <span>{t(item.labelKey)}</span>

                {/* Active pulse dot */}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: "#4338CA" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Language + Logout */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="space-y-1">
            <LanguageSwitcher variant="light" />
            <form action="/logout" method="post">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t("nav.logout")}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
