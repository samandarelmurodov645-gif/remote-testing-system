function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function StudentTestDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Sk className="h-4 w-28 mb-6" />

      {/* Test card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
        <div className="h-2 bg-slate-200" />
        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <Sk className="h-14 w-14 rounded-2xl shrink-0" />
            <div className="flex-1">
              <Sk className="h-7 w-3/4 mb-2" />
              <Sk className="h-4 w-full mb-1" />
              <Sk className="h-4 w-2/3" />
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Sk className="h-7 w-12 mx-auto mb-1" />
                <Sk className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>

          {/* Before start */}
          <div className="mb-6">
            <Sk className="h-5 w-36 mb-3" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Sk className="h-4 w-4 rounded-full" />
                  <Sk className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>

          <Sk className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
