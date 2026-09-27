export default function LoadingVoitures() {
  return (
    <main className="min-h-screen bg-background pb-28 md:pb-10">
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl animate-shimmer rounded-[32px] p-7 sm:p-10">
          <div className="h-6 w-40 rounded-full bg-surface-container-high" />
          <div className="mt-4 h-12 w-2/3 rounded-2xl bg-surface-container-high" />
          <div className="mt-3 h-5 w-full max-w-xl rounded-xl bg-surface-container-high" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-5">
        <div className="animate-shimmer rounded-[28px] p-5">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[56px] rounded-2xl bg-surface-container-high" />
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest">
              <div className="aspect-[16/10] animate-shimmer" />
              <div className="space-y-2.5 p-5">
                <div className="h-4 w-1/3 rounded-full bg-surface-container-high" />
                <div className="h-6 w-2/3 rounded-full bg-surface-container-high" />
                <div className="h-14 rounded-2xl bg-surface-container" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
