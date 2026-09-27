export default function LoadingAdmin() {
  return (
    <div className="animate-m3-fade-up">
      <div className="h-9 w-56 rounded-2xl bg-surface-container-high" />
      <div className="mt-2 h-4 w-48 rounded-full bg-surface-container" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-[24px] border border-outline-variant/40 bg-surface-container-lowest p-5">
            <div className="h-11 w-11 animate-shimmer rounded-2xl" />
            <div className="mt-3 h-3 w-20 rounded-full bg-surface-container" />
            <div className="mt-2 h-8 w-16 rounded-xl bg-surface-container-high" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="animate-shimmer h-64 rounded-[28px]" />
        <div className="animate-shimmer h-64 rounded-[28px]" />
      </div>
    </div>
  );
}
