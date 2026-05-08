function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center flex-1 bg-slate-900 p-12">
        <Sk className="h-10 w-40 mb-6 bg-slate-700" />
        <Sk className="h-8 w-64 mb-2 bg-slate-700" />
        <Sk className="h-8 w-48 mb-6 bg-slate-700" />
        <Sk className="h-4 w-80 mb-8 bg-slate-700" />
        <div className="flex gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Sk className="h-7 w-16 mb-1 bg-slate-700" />
              <Sk className="h-3 w-20 bg-slate-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-md">
          <Sk className="h-8 w-40 mb-2" />
          <Sk className="h-4 w-60 mb-8" />
          <div className="space-y-4">
            <div>
              <Sk className="h-4 w-20 mb-1.5" />
              <Sk className="h-11 w-full rounded-xl" />
            </div>
            <div>
              <Sk className="h-4 w-20 mb-1.5" />
              <Sk className="h-11 w-full rounded-xl" />
            </div>
            <Sk className="h-11 w-full rounded-xl" />
          </div>
          <Sk className="h-4 w-48 mx-auto mt-6" />
        </div>
      </div>
    </div>
  );
}
