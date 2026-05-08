function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AdminCompetitionsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-52 mb-2" />
        <Sk className="h-4 w-80" />
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <Sk className="h-6 w-52 mb-6" />
        <div className="grid md:grid-cols-2 gap-4">
          <Sk className="h-10 w-full" />
          <Sk className="h-10 w-full" />
          <Sk className="h-10 w-full" />
          <Sk className="h-10 w-full" />
          <Sk className="h-10 w-full" />
          <Sk className="h-10 w-full" />
        </div>
        <Sk className="h-10 w-full mt-4" />
        <div className="flex items-center gap-2 mt-4">
          <Sk className="h-5 w-5 rounded" />
          <Sk className="h-4 w-36" />
        </div>
        <Sk className="h-11 w-44 mt-4" />
      </div>

      {/* Competitions list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Sk className="h-6 w-44 mb-1" />
          <Sk className="h-4 w-60 mt-2" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 space-y-2">
                <Sk className="h-5 w-48" />
                <Sk className="h-3 w-32" />
              </div>
              <Sk className="h-5 w-16 rounded-full" />
              <Sk className="h-4 w-24" />
              <Sk className="h-4 w-24" />
              <Sk className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
