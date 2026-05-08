function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function StudentCompetitionsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-44 mb-2" />
        <Sk className="h-4 w-72" />
      </div>

      {/* Competition cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <Sk className="h-6 w-48" />
              <Sk className="h-5 w-16 rounded-full" />
            </div>
            <Sk className="h-4 w-full mb-1" />
            <Sk className="h-4 w-2/3 mb-4" />
            <div className="flex items-center gap-4 mb-4 pt-3 border-t border-slate-100">
              <Sk className="h-4 w-24" />
              <Sk className="h-4 w-24" />
            </div>
            <Sk className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
