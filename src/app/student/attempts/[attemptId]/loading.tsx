function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AttemptLoading() {
  return (
    <div>
      {/* Header row: title + timer */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Sk className="h-7 w-44 mb-2" />
          <Sk className="h-4 w-28" />
        </div>
        <Sk className="h-12 w-32 rounded-xl" />
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <Sk className="h-4 w-20" />
          <Sk className="h-4 w-24" />
        </div>
        <Sk className="h-2 w-full rounded-full" />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <Sk className="h-6 w-24 rounded-lg mb-4" />
        <Sk className="h-6 w-full mb-1" />
        <Sk className="h-6 w-3/4 mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Sk key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between">
        <Sk className="h-11 w-28 rounded-xl" />
        <Sk className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}
