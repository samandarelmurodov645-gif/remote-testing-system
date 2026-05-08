function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

function TestCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="h-1.5 bg-slate-200" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Sk className="h-12 w-12 rounded-xl" />
          <Sk className="h-5 w-16 rounded-full" />
        </div>
        <Sk className="h-5 w-3/4 mb-2" />
        <Sk className="h-4 w-full mb-1" />
        <Sk className="h-4 w-2/3 mb-4 flex-1" />
        <div className="flex items-center gap-4 mb-5 pt-4 border-t border-slate-100">
          <Sk className="h-4 w-20" />
          <Sk className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-10 flex-1 rounded-xl" />
          <Sk className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function StudentTestsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-44 mb-2" />
        <Sk className="h-4 w-64" />
      </div>

      {/* Tests grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <TestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
