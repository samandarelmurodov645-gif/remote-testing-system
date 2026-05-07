import Link from "next/link";
import { getCurrentUser, getCurrentUserRole } from "@/lib/auth";
import { Button } from "@/components/ui";
import { getServerT } from "@/lib/i18n";

export default async function Home() {
  const [user, role, t] = await Promise.all([
    getCurrentUser(),
    getCurrentUserRole(),
    getServerT(),
  ]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 animate-gradient" />
      <div className="absolute inset-0 bg-dots opacity-40" />

      {/* Floating decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float delay-200" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-400" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">TestPro</span>
          </Link>

          <div className="flex items-center gap-3">
            {!user ? (
              <Link href="/login">
                <Button variant="primary" size="md">
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
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8 animate-fade-in-up">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  {t("home.badge")}
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up delay-100">
                  {t("home.title1")}
                  <br />
                  <span className="gradient-text">{t("home.title2")}</span>
                </h1>

                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                  {t("home.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                  <Link href="/login">
                    <Button variant="primary" size="lg" className="min-w-48 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all">
                      {t("home.startFree")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="min-w-48">
                    {t("home.demo")}
                  </Button>
                </div>
              </div>

              {/* Stats bar */}
              <div className="glass rounded-2xl p-6 mb-16 shadow-xl animate-fade-in-up delay-400">
                <div className="grid grid-cols-3 gap-6 divide-x divide-slate-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">10K+</div>
                    <div className="text-sm text-slate-600 mt-1">Students</div>
                  </div>
                  <div className="text-center pl-6">
                    <div className="text-3xl font-bold gradient-text">500+</div>
                    <div className="text-sm text-slate-600 mt-1">Tests</div>
                  </div>
                  <div className="text-center pl-6">
                    <div className="text-3xl font-bold gradient-text">98%</div>
                    <div className="text-sm text-slate-600 mt-1">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    color: "from-indigo-500 to-indigo-600",
                    bgColor: "bg-indigo-50",
                    titleKey: "home.feature1.title",
                    descKey: "home.feature1.desc",
                    delay: "delay-100",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ),
                    color: "from-purple-500 to-purple-600",
                    bgColor: "bg-purple-50",
                    titleKey: "home.feature2.title",
                    descKey: "home.feature2.desc",
                    delay: "delay-200",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    ),
                    color: "from-emerald-500 to-emerald-600",
                    bgColor: "bg-emerald-50",
                    titleKey: "home.feature3.title",
                    descKey: "home.feature3.desc",
                    delay: "delay-300",
                  },
                ].map((feat, i) => (
                  <div key={i} className={`card-hover ${feat.bgColor} rounded-2xl p-6 animate-fade-in-up ${feat.delay}`}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feat.icon}
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">{t(feat.titleKey)}</h3>
                    <p className="text-slate-600 text-sm text-center leading-relaxed">{t(feat.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Logged-in state */
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-200 animate-pulse-ring">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-3 animate-fade-in-up">
                {t("home.welcome")}
              </h1>

              <p className="text-lg text-slate-600 mb-10 animate-fade-in-up delay-100">
                {t("home.loggedInAs")}{" "}
                <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                  {user.email ?? user.id}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                {role === "admin" ? (
                  <Link href="/admin/tests">
                    <Button variant="primary" size="lg" className="min-w-48 shadow-lg shadow-indigo-200">
                      {t("home.goToAdmin")}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/student/tests">
                    <Button variant="primary" size="lg" className="min-w-48 shadow-lg shadow-indigo-200">
                      {t("home.goToStudent")}
                    </Button>
                  </Link>
                )}
                <form action="/logout" method="post">
                  <Button type="submit" variant="outline" size="lg" className="min-w-48">
                    {t("nav.logout")}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
