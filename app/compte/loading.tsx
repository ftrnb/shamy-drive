export default function LoadingCompte() {
  return (
    <main className="min-h-screen bg-background pb-28 md:pb-10">
      <div className="px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="mx-auto max-w-6xl animate-shimmer rounded-[32px] p-7 sm:p-8">
          <div className="h-7 w-40 rounded-full bg-surface-container-high" />
          <div className="mt-3 h-9 w-2/3 max-w-sm rounded-2xl bg-surface-container-high" />
          <div className="mt-2 h-4 w-48 rounded-full bg-surface-container-high" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-3 px-3 py-6 sm:px-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-[28px] border border-outline-variant/40 bg-surface-container-lowest p-5 sm:flex-row sm:items-center">
            <div className="h-28 w-full shrink-0 animate-shimmer rounded-2xl sm:w-44" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-1/2 rounded-full bg-surface-container-high" />
              <div className="h-4 w-2/3 rounded-full bg-surface-container" />
              <div className="h-6 w-24 rounded-full bg-surface-container" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
