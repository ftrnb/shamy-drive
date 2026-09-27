export default function LoadingDetail() {
  return (
    <main className="min-h-screen bg-background pb-28 md:pb-10">
      <div className="mx-auto max-w-6xl px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[32px] border border-outline-variant/40 bg-surface-container-lowest">
            <div className="aspect-[16/10] animate-shimmer" />
            <div className="grid grid-cols-2 gap-2.5 p-5 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[62px] rounded-2xl bg-surface-container" />
              ))}
            </div>
          </div>
          <div className="rounded-[32px] bg-surface-container p-6 sm:p-8">
            <div className="h-4 w-1/3 rounded-full bg-surface-container-high" />
            <div className="mt-2 h-10 w-2/3 rounded-2xl bg-surface-container-high" />
            <div className="mt-5 h-28 rounded-[20px] bg-surface-container-high" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-surface-container-high" />
              ))}
            </div>
            <div className="mt-6 h-[56px] rounded-full bg-surface-container-high" />
          </div>
        </div>
      </div>
    </main>
  );
}
