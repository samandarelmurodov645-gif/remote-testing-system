function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function StudentResultsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Sk className="h-8 w-44 mb-2" />
          <Sk className="h-4 w-60" />
        </div>
        <Sk className="h-9 w-28 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
            <Sk className="h-8 w-12 mb-1" />
            <Sk className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Result cards */}
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Sk className="h-5 w-48 mb-2" />
                <div className="flex items-center gap-2">
                  <Sk className="h-4 w-32" />
                  <Sk className="h-5 w-20 rounded-full" />
                </div>
              </div>
              <Sk className="h-14 w-14 rounded-full shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
