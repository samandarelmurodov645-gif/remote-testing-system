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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const logoGradient =
    role === "admin"
      ? "from-violet-500 to-purple-700"
      : "from-indigo-500 to-cyan-500";

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #312e81, #4c1d95)", boxShadow: "0 4px 16px rgba(79,70,229,0.4)" }}
        aria-label="Open menu"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
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
          background: "linear-gradient(180deg, #1e1b4b 0%, #2d2a7a 35%, #3b1f6e 65%, #4c1d95 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top shimmer accent bar */}
        <div
          className="h-0.5 shrink-0"
          style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4, #7c3aed, #4f46e5)", backgroundSize: "200% 100%", animation: "gradient-shift 4s linear infinite" }}
        />

        {/* Logo */}
        <div className="px-5 py-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <Link
            href={logoHref}
            className="flex items-center gap-3 group"
            onClick={() => NProgress.start()}
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${logoGradient} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110`}
              style={{ boxShadow: "0 4px 14px rgba(99,102,241,0.45)" }}
            >
              <span className="text-white font-bold text-lg">{logoLetter}</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">{logoLabel}</span>
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
                    ? "sidebar-active text-white"
                    : "text-indigo-200/60 hover:text-white hover:bg-white/8",
                ].join(" ")}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Active left accent */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #818cf8, #06b6d4)" }}
                  />
                )}

                {/* Icon */}
                <span className={`shrink-0 transition-all duration-200 ${isActive ? "text-indigo-300" : "text-indigo-400/50 group-hover:text-indigo-300 group-hover:scale-110"}`}>
                  {item.icon}
                </span>

                <span>{t(item.labelKey)}</span>

                {/* Active dot */}
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: "#06b6d4" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Language + Logout */}
        <div className="p-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="space-y-1">
            <LanguageSwitcher />
            <form action="/logout" method="post">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-indigo-200/50 hover:bg-red-500/15 hover:text-red-300 transition-all group"
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
