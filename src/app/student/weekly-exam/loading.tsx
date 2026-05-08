function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function WeeklyExamLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Sk className="h-9 w-48 mx-auto mb-3" />
        <Sk className="h-4 w-72 mx-auto mb-2" />
        <Sk className="h-4 w-56 mx-auto" />
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sk className="h-8 w-8 rounded-lg" />
          <Sk className="h-5 w-36" />
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <Sk className="h-4 w-24" />
            <Sk className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Sk className="h-4 w-32" />
            <Sk className="h-4 w-20" />
          </div>
          <div className="flex justify-between">
            <Sk className="h-4 w-28" />
            <Sk className="h-4 w-16" />
          </div>
        </div>
        <Sk className="h-12 w-full rounded-xl" />
      </div>

      {/* Mode badges */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Sk className="h-16 rounded-xl" />
        <Sk className="h-16 rounded-xl" />
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <Sk className="h-5 w-40" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
            <Sk className="h-6 w-6 rounded-full" />
            <Sk className="h-4 flex-1" />
            <Sk className="h-4 w-10" />
            <Sk className="h-4 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
