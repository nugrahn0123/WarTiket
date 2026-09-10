export default function Loading() {
  return (
    <div
      className="flex items-center justify-center h-screen bg-wt-surface"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-9 h-9 rounded-full border-2 border-wt-border border-t-wt-accent animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Memuat halaman</span>
    </div>
  )
}
