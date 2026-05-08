function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function AdminTestsLoading() {
  return (
    <div>
      {/* PageHeader */}
      <div className="mb-8">
        <Sk className="h-8 w-52 mb-2" />
        <Sk className="h-4 w-80" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <Sk className="h-11 w-11 rounded-xl" />
            </div>
            <Sk className="h-8 w-16 mb-1" />
            <Sk className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Excel upload section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Sk className="h-8 w-8 rounded-lg" />
          <Sk className="h-6 w-52" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Sk className="h-44 rounded-xl" />
          <div className="space-y-3">
            <Sk className="h-4 w-36 mb-3" />
            <Sk className="h-16 rounded-xl" />
            {[...Array(4)].map((_, i) => (
              <Sk key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <Sk className="h-6 w-44 mb-6" />
        <div className="space-y-4">
          <Sk className="h-10 w-full" />
          <Sk className="h-20 w-full" />
          <div className="grid md:grid-cols-2 gap-4">
            <Sk className="h-10 w-full" />
            <Sk className="h-10 w-full" />
          </div>
          <Sk className="h-11 w-32" />
        </div>
      </div>

      {/* Tests table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <Sk className="h-6 w-36 mb-1" />
          <Sk className="h-4 w-56 mt-2" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Sk className="h-4 flex-1" />
              <Sk className="h-5 w-20 rounded-full" />
              <Sk className="h-4 w-16" />
              <Sk className="h-4 w-12" />
              <div className="flex gap-2 ml-auto">
                <Sk className="h-8 w-16 rounded-lg" />
                <Sk className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
