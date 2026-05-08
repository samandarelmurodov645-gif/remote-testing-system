function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Sk className="h-7 w-28" />
        <div className="flex items-center gap-3">
          <Sk className="h-8 w-24 rounded-xl" />
          <Sk className="h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <Sk className="h-5 w-52 rounded-full mx-auto mb-6" />
        <Sk className="h-12 w-2/3 mx-auto mb-3" />
        <Sk className="h-12 w-1/2 mx-auto mb-6" />
        <Sk className="h-4 w-3/4 mx-auto mb-2" />
        <Sk className="h-4 w-2/3 mx-auto mb-10" />
        <div className="flex items-center justify-center gap-4">
          <Sk className="h-12 w-40 rounded-xl" />
          <Sk className="h-12 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 mb-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <Sk className="h-9 w-20 mx-auto mb-2" />
            <Sk className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <Sk className="h-10 w-10 rounded-xl mb-4" />
            <Sk className="h-5 w-32 mb-2" />
            <Sk className="h-4 w-full mb-1" />
            <Sk className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
