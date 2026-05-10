import Link from "next/link";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/Logo";
import { getServerT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const SYMBOLS = [
  { s: "∑",      l: "7%",  t: "72%", delay: "0s",    dur: "14s", fs: "1.9rem", op: 0.18 },
  { s: "π",      l: "14%", t: "42%", delay: "2.5s",  dur: "18s", fs: "1.5rem", op: 0.2  },
  { s: "∫",      l: "22%", t: "62%", delay: "5s",    dur: "15s", fs: "2.4rem", op: 0.13 },
  { s: "√",      l: "30%", t: "28%", delay: "1s",    dur: "17s", fs: "1.7rem", op: 0.17 },
  { s: "∞",      l: "38%", t: "78%", delay: "8s",    dur: "19s", fs: "1.6rem", op: 0.15 },
  { s: "Δ",      l: "46%", t: "22%", delay: "3s",    dur: "16s", fs: "2.1rem", op: 0.12 },
  { s: "α",      l: "53%", t: "55%", delay: "6s",    dur: "13s", fs: "1.5rem", op: 0.2  },
  { s: "β",      l: "61%", t: "38%", delay: "0.5s",  dur: "20s", fs: "1.7rem", op: 0.16 },
  { s: "θ",      l: "68%", t: "68%", delay: "4s",    dur: "17s", fs: "1.4rem", op: 0.19 },
  { s: "x²",     l: "75%", t: "32%", delay: "7s",    dur: "15s", fs: "1.6rem", op: 0.14 },
  { s: "H₂O",   l: "82%", t: "58%", delay: "1.5s",  dur: "18s", fs: "1.3rem", op: 0.17 },
  { s: "CO₂",   l: "90%", t: "48%", delay: "9s",    dur: "16s", fs: "1.2rem", op: 0.14 },
  { s: "1776",   l: "10%", t: "88%", delay: "11s",   dur: "21s", fs: "1.1rem", op: 0.11 },
  { s: "E=mc²", l: "34%", t: "14%", delay: "4.5s",  dur: "17s", fs: "1.2rem", op: 0.13 },
  { s: "F=ma",   l: "55%", t: "84%", delay: "6.5s",  dur: "19s", fs: "1.1rem", op: 0.13 },
  { s: "λ",      l: "78%", t: "18%", delay: "2.5s",  dur: "14s", fs: "2.2rem", op: 0.15 },
  { s: "1945",   l: "88%", t: "76%", delay: "7.5s",  dur: "20s", fs: "1rem",   op: 0.11 },
  { s: "y=mx+b", l: "43%", t: "46%", delay: "10s",  dur: "23s", fs: "0.95rem", op: 0.1 },
  { s: "A",      l: "3%",  t: "52%", delay: "12s",   dur: "26s", fs: "3.2rem", op: 0.07 },
  { s: "ψ",      l: "25%", t: "8%",  delay: "3.5s",  dur: "16s", fs: "1.8rem", op: 0.14 },
  { s: "∇",      l: "64%", t: "12%", delay: "8.5s",  dur: "18s", fs: "1.6rem", op: 0.12 },
  { s: "Ω",      l: "92%", t: "22%", delay: "5.5s",  dur: "22s", fs: "1.9rem", op: 0.13 },
];

export default async function Home() {
  const [user, role, t] = await Promise.all([
    getCurrentUser(),
    getCurrentUserRole(),
    getServerT(),
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#1A1A2E" }}>

      {/* Deep space gradient — indigo + emerald */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(67,56,202,0.2) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 15%, rgba(16,185,129,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 55% 90%, rgba(5,150,105,0.08) 0%, transparent 50%)
        `
      }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-1" />
        <div className="stars-2" />
        <div className="stars-3" />
      </div>

      {/* Floating educational symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {SYMBOLS.map((sym, i) => (
          <span
            key={i}
            className="absolute font-mono font-bold animate-sym-drift"
            style={{
              left: sym.l,
              top: sym.t,
              fontSize: sym.fs,
              opacity: sym.op,
              color: "#6ee7b7",
              animationDelay: sym.delay,
              animationDuration: sym.dur,
            }}
          >
            {sym.s}
          </span>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation */}
        <nav className="flex items-center justify-between py-6 animate-fade-in">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300">
              <Logo size={40} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TestPro</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher dropUp={false} />
            {!user ? (
              <Link href="/login">
                <Button variant="primary" size="md" className="btn-ripple">
                  {t("nav.login")}
                </Button>
              </Link>
            ) : (
              <form action="/logout" method="post">
                <Button type="submit" variant="ghost" size="md" className="btn-ripple text-slate-300 hover:bg-white/10 hover:text-white">
                  {t("nav.logout")}
                </Button>
              </form>
            )}
          </div>
        </nav>

        {/* Main content */}
        <main className="py-16 lg:py-24">
          {!user ? (
            <div className="max-w-5xl mx-auto">

              {/* Hero */}
              <div className="text-center mb-20 relative">
                {/* Glowing orb — indigo + emerald */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none animate-glow-pulse"
                  style={{ background: "radial-gradient(ellipse, rgba(67,56,202,0.2) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)" }}
                />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/25 text-emerald-300 text-sm font-medium mb-8 animate-fade-in-up">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t("home.badge")}
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.08] tracking-tight animate-fade-in-up delay-100">
                  {t("home.title1")}
                  <br />
                  <span className="shimmer-text">{t("home.title2")}</span>
                </h1>

                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                  {t("home.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                  <Link href="/login">
                    <Button variant="primary" size="lg" className="min-w-52 btn-ripple hover:-translate-y-1 transition-all">
                      {t("home.startFree")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-52 btn-ripple border-white/20 text-white hover:bg-white/10 hover:border-white/35 hover:-translate-y-1 transition-all"
                  >
                    {t("home.demo")}
                  </Button>
                </div>
              </div>

              {/* Stats bar */}
              <div className="glass rounded-2xl px-8 py-6 mb-16 border border-white/10 animate-fade-in-up delay-400">
                <div className="grid grid-cols-3 gap-4 divide-x divide-white/10">
                  {[
                    { value: "10K+", labelKey: "home.stats.students" },
                    { value: "500+", labelKey: "home.stats.tests" },
                    { value: "98%",  labelKey: "home.stats.satisfaction" },
                  ].map((s, i) => (
                    <div key={i} className={`text-center ${i > 0 ? "pl-4" : ""}`}>
                      <div className="text-3xl font-bold shimmer-text">{s.value}</div>
                      <div className="text-sm text-slate-400 mt-1 font-medium">{t(s.labelKey)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    gradient: "from-indigo-700 to-indigo-500",
                    glow: "shadow-indigo-600/30",
                    titleKey: "home.feature1.title",
                    descKey: "home.feature1.desc",
                    delay: "delay-100",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    gradient: "from-violet-600 to-indigo-600",
                    glow: "shadow-violet-500/30",
                    titleKey: "home.feature2.title",
                    descKey: "home.feature2.desc",
                    delay: "delay-200",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                    gradient: "from-emerald-600 to-emerald-500",
                    glow: "shadow-emerald-500/30",
                    titleKey: "home.feature3.title",
                    descKey: "home.feature3.desc",
                    delay: "delay-300",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className={`glass rounded-2xl p-7 border border-white/8 glow-on-hover card-tilt animate-pop-in ${feat.delay} group cursor-default`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 shadow-lg ${feat.glow} icon-bounce group-hover:scale-110 transition-transform`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feat.icon}
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t(feat.titleKey)}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{t(feat.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Logged-in state */
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse-ring" style={{ background: "linear-gradient(135deg, #4338CA, #10B981)", boxShadow: "0 20px 60px rgba(67,56,202,0.4)" }}>
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h1 className="text-4xl font-extrabold text-white mb-3 animate-fade-in-up tracking-tight">
                {t("home.welcome")}
              </h1>

              <p className="text-lg text-slate-400 mb-10 animate-fade-in-up delay-100">
                {t("home.loggedInAs")}{" "}
                <span className="font-semibold text-emerald-300 bg-emerald-500/12 border border-emerald-500/25 px-2.5 py-0.5 rounded-lg text-base">
                  {user.email ?? user.id}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                {role === "admin" ? (
                  <Link href="/admin/tests">
                    <Button variant="primary" size="lg" className="min-w-52 btn-ripple hover:-translate-y-0.5 transition-all">
                      {t("home.goToAdmin")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/student/tests">
                    <Button variant="primary" size="lg" className="min-w-52 btn-ripple hover:-translate-y-0.5 transition-all">
                      {t("home.goToStudent")}
                    </Button>
                  </Link>
                )}
                <form action="/logout" method="post">
                  <Button type="submit" variant="outline" size="lg" className="min-w-52 btn-ripple border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                    {t("nav.logout")}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-slate-600 border-t border-white/5">
          <p>© {new Date().getFullYear()} TestPro. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
