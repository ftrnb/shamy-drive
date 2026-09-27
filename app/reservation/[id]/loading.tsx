export default function LoadingReservation() {
  return (
    <main className="min-h-screen bg-background pb-28 md:pb-10">
      <div className="mx-auto max-w-6xl px-3 pt-24 sm:px-5 sm:pt-28">
        <div className="animate-shimmer rounded-[32px] p-7 sm:p-8">
          <div className="h-10 w-48 rounded-full bg-surface-container-high" />
          <div className="mt-4 h-9 w-2/3 rounded-2xl bg-surface-container-high" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-shimmer h-[420px] rounded-[32px]" />
          <div className="animate-shimmer h-[560px] rounded-[32px]" />
        </div>
      </div>
    </main>
  );
}
