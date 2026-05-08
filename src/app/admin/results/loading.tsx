function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AdminResultsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-48 mb-2" />
        <Sk className="h-4 w-72" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200">
            <Sk className="h-8 w-12 mb-1" />
            <Sk className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Info note */}
      <Sk className="h-10 w-full rounded-xl mb-4" />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
          {[...Array(6)].map((_, i) => (
            <Sk key={i} className="h-4 w-full" />
          ))}
        </div>
        {/* Data rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-slate-100">
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-full" />
            <Sk className="h-5 w-20 rounded-full" />
            <Sk className="h-5 w-10" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
