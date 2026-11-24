// Lightweight skeleton loader used while lazy page chunks load.

export default function PageSkeleton({
  variant = "admin",
}: {
  variant?: "admin" | "content";
}) {
  if (variant === "admin") {
    return (
      <div className="min-h-screen p-4 md:p-8 text-[rgb(var(--text-primary))] animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-9 h-9 rounded-full bg-[var(--fill)]" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-48 rounded-md bg-[var(--fill)]" />
              <div className="h-3 w-64 rounded-md bg-[var(--fill)]/60" />
            </div>
            <div className="ml-auto h-10 w-28 rounded-xl bg-[var(--fill)]" />
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="hidden md:flex md:flex-col gap-2 w-64 shrink-0">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-11 rounded-xl bg-[var(--fill)]"
                  style={{ width: `${92 - (i % 3) * 8}%` }}
                />
              ))}
            </div>
            <div className="flex-1 glass-panel p-4 md:p-8 min-h-[500px]">
              <div className="flex flex-col gap-3">
                <div className="h-6 w-40 rounded-md bg-[var(--fill)]" />
                <div className="h-3 w-full rounded-md bg-[var(--fill)]/60" />
                <div className="h-3 w-5/6 rounded-md bg-[var(--fill)]/60" />
                <div className="h-32 rounded-xl bg-[var(--fill)] mt-4" />
                <div className="h-20 rounded-xl bg-[var(--fill)]/70" />
                <div className="h-20 rounded-xl bg-[var(--fill)]/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6 md:p-12 animate-pulse">
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <div className="h-8 w-3/4 rounded-lg bg-[var(--fill)]" />
        <div className="h-3 w-40 rounded-md bg-[var(--fill)]/60" />
        <div className="h-3 w-full rounded-md bg-[var(--fill)]/60" />
        <div className="h-3 w-5/6 rounded-md bg-[var(--fill)]/60" />
        <div className="h-48 rounded-xl bg-[var(--fill)] mt-4" />
        <div className="h-3 w-full rounded-md bg-[var(--fill)]/60" />
        <div className="h-3 w-2/3 rounded-md bg-[var(--fill)]/60" />
      </div>
    </div>
  );
}