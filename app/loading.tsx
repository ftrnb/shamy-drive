export default function LoadingHome() {
  return (
    <main className="min-h-screen bg-background pb-2">
      <div className="bg-background px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl animate-shimmer rounded-[32px] p-7 sm:p-10 lg:p-12">
          <div className="h-8 w-56 rounded-full bg-surface-container-high" />
          <div className="mt-5 h-16 w-3/4 max-w-lg rounded-2xl bg-surface-container-high sm:h-20" />
          <div className="mt-5 h-5 w-full max-w-md rounded-xl bg-surface-container-high" />
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <div className="h-[56px] flex-1 rounded-full bg-surface-container-high sm:max-w-[240px]" />
            <div className="h-[56px] flex-1 rounded-full bg-surface-container-high sm:max-w-[200px]" />
          </div>
        </div>
      </div>
      <div className="h-5" />
      <div className="px-3 sm:px-5">
        <div className="mx-auto max-w-6xl animate-shimmer rounded-[28px] p-4 sm:p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[56px] rounded-2xl bg-surface-container-high" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-3 py-12 sm:px-5">
        <div className="mb-8 h-12 w-2/3 max-w-md rounded-2xl bg-surface-container" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
