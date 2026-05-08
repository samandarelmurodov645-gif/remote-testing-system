function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function CompetitionResultsLoading() {
  return (
    <div>
      {/* Back link */}
      <Sk className="h-4 w-36 mb-6" />

      {/* Score card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 text-center">
        <Sk className="h-6 w-48 mx-auto mb-6" />
        <Sk className="h-24 w-24 rounded-full mx-auto mb-4" />
        <Sk className="h-8 w-32 mx-auto mb-2" />
        <Sk className="h-4 w-48 mx-auto" />
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Sk className="h-6 w-32" />
        </div>
        {[...Array(6)].map((_, i) => (
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
