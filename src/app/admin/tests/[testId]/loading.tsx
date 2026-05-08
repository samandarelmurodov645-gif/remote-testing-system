function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AdminTestDetailLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-48 mb-2" />
        <Sk className="h-4 w-64" />
      </div>

      {/* Excel import */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sk className="h-8 w-8 rounded-lg" />
            <Sk className="h-6 w-48" />
          </div>
          <Sk className="h-8 w-36 rounded-lg" />
        </div>
        <Sk className="h-24 w-full rounded-xl mb-4" />
        <Sk className="h-10 w-48 rounded-lg" />
      </div>

      {/* Settings form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <Sk className="h-6 w-36 mb-1" />
        <Sk className="h-4 w-64 mb-6" />
        <div className="space-y-4">
          <Sk className="h-10 w-full" />
          <Sk className="h-20 w-full" />
          <div className="grid md:grid-cols-2 gap-4">
            <Sk className="h-10 w-full" />
            <Sk className="h-10 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Sk className="h-5 w-5 rounded" />
            <Sk className="h-4 w-32" />
          </div>
          <div className="flex gap-3">
            <Sk className="h-11 w-40" />
            <Sk className="h-11 w-28" />
          </div>
        </div>
      </div>

      {/* Add question form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <Sk className="h-6 w-32 mb-4" />
        <Sk className="h-20 w-full mb-3" />
        <Sk className="h-10 w-36" />
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Sk className="h-4 w-16 mb-2" />
                <Sk className="h-5 w-3/4" />
              </div>
              <div className="flex gap-2">
                <Sk className="h-8 w-8 rounded-lg" />
                <Sk className="h-8 w-8 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2 ml-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Sk className="h-4 flex-1" />
                  <Sk className="h-7 w-24 rounded-lg" />
                  <Sk className="h-7 w-7 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
