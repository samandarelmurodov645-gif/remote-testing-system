function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function CompetitionDetailLoading() {
  return (
    <div>
      {/* Back link */}
      <Sk className="h-4 w-32 mb-6" />

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="h-2 bg-slate-200" />
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <Sk className="h-7 w-3/4 mb-2" />
              <Sk className="h-4 w-full mb-1" />
              <Sk className="h-4 w-2/3" />
            </div>
            <Sk className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3">
                <Sk className="h-3 w-16 mb-2" />
                <Sk className="h-5 w-24" />
              </div>
            ))}
          </div>
          <Sk className="h-12 w-48 rounded-xl" />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Sk className="h-6 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
            <Sk className="h-7 w-7 rounded-full" />
            <Sk className="h-4 flex-1" />
            <Sk className="h-5 w-12" />
            <Sk className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
