function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AdminCompetitionDetailLoading() {
  return (
    <div>
      {/* PageHeader with action */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Sk className="h-8 w-64 mb-2" />
          <Sk className="h-4 w-48" />
        </div>
        <Sk className="h-9 w-32 rounded-lg" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
            <Sk className="h-7 w-10 mb-1" />
            <Sk className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <Sk className="h-6 w-48 mb-6" />
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Sk key={i} className="h-10 w-full" />
          ))}
        </div>
        <Sk className="h-11 w-40 mt-4" />
      </div>

      {/* Leaderboard table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Sk className="h-6 w-40" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Sk className="h-7 w-7 rounded-full" />
              <Sk className="h-4 flex-1" />
              <Sk className="h-5 w-12" />
              <Sk className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
