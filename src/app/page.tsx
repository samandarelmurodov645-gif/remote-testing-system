import Link from "next/link";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { Button } from "@/components/ui";
import { getServerT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default async function Home() {
  const [user, role, t] = await Promise.all([
    getCurrentUser(),
    getCurrentUserRole(),
    getServerT(),
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/60 to-purple-50/80 animate-gradient" />
      <div className="absolute inset-0 bg-dots opacity-30" />

      {/* Floating decorative blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float delay-200" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-400" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">TestPro</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="light" dropUp={false} />
            {!user ? (
              <Link href="/login">
                <Button variant="primary" size="md" className="shadow-md shadow-indigo-200">
                  {t("nav.login")}
                </Button>
              </Link>
            ) : (
              <form action="/logout" method="post">
                <Button type="submit" variant="ghost" size="md">
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
              <div className="text-center mb-20">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/80 border border-indigo-200/60 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  {t("home.badge")}
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.08] tracking-tight animate-fade-in-up delay-100">
                  {t("home.title1")}
                  <br />
                  <span className="gradient-text">{t("home.title2")}</span>
                </h1>

                <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                  {t("home.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                  <Link href="/login">
                    <Button variant="primary" size="lg" className="min-w-52 shadow-xl shadow-indigo-200/60 hover:shadow-indigo-300/60 hover:-translate-y-0.5 transition-all">
                      {t("home.startFree")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="min-w-52 hover:-translate-y-0.5 transition-all">
                    {t("home.demo")}
                  </Button>
                </div>
              </div>

              {/* Stats bar */}
              <div className="glass rounded-2xl px-8 py-6 mb-16 shadow-xl shadow-slate-200/50 border-white/60 animate-fade-in-up delay-400">
                <div className="grid grid-cols-3 gap-4 divide-x divide-slate-200">
                  {[
                    { value: "10K+", labelKey: "home.stats.students" },
                    { value: "500+", labelKey: "home.stats.tests" },
                    { value: "98%", labelKey: "home.stats.satisfaction" },
                  ].map((s, i) => (
                    <div key={i} className={`text-center ${i > 0 ? "pl-4" : ""}`}>
                      <div className="text-3xl font-bold gradient-text">{s.value}</div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">{t(s.labelKey)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    gradient: "from-indigo-500 to-indigo-600",
                    bg: "bg-indigo-50/80",
                    ring: "ring-indigo-100",
                    titleKey: "home.feature1.title",
                    descKey: "home.feature1.desc",
                    delay: "delay-100",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    gradient: "from-purple-500 to-purple-600",
                    bg: "bg-purple-50/80",
                    ring: "ring-purple-100",
                    titleKey: "home.feature2.title",
                    descKey: "home.feature2.desc",
                    delay: "delay-200",
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                    gradient: "from-emerald-500 to-emerald-600",
                    bg: "bg-emerald-50/80",
                    ring: "ring-emerald-100",
                    titleKey: "home.feature3.title",
                    descKey: "home.feature3.desc",
                    delay: "delay-300",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className={`card-hover ${feat.bg} rounded-2xl p-7 ring-1 ${feat.ring} animate-fade-in-up ${feat.delay} group`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feat.icon}
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{t(feat.titleKey)}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{t(feat.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Logged-in state */
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-300/50 animate-pulse-ring">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 animate-fade-in-up tracking-tight">
                {t("home.welcome")}
              </h1>

              <p className="text-lg text-slate-500 mb-10 animate-fade-in-up delay-100">
                {t("home.loggedInAs")}{" "}
                <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg text-base">
                  {user.email ?? user.id}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                {role === "admin" ? (
                  <Link href="/admin/tests">
                    <Button variant="primary" size="lg" className="min-w-52 shadow-xl shadow-indigo-200/60 hover:-translate-y-0.5 transition-all">
                      {t("home.goToAdmin")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/student/tests">
                    <Button variant="primary" size="lg" className="min-w-52 shadow-xl shadow-indigo-200/60 hover:-translate-y-0.5 transition-all">
                      {t("home.goToStudent")}
                    </Button>
                  </Link>
                )}
                <form action="/logout" method="post">
                  <Button type="submit" variant="outline" size="lg" className="min-w-52 hover:-translate-y-0.5 transition-all">
                    {t("nav.logout")}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-slate-400 border-t border-slate-200/50">
          <p>© {new Date().getFullYear()} TestPro. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
