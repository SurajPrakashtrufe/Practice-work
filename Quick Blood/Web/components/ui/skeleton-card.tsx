function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.4s_ease-in-out_infinite] rounded-xl ${className}`}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
      <Shimmer className="w-8 h-8 rounded-xl" />
      <div className="space-y-1.5">
        <Shimmer className="h-2.5 w-16" />
        <Shimmer className="h-5 w-10" />
        <Shimmer className="h-2 w-20" />
      </div>
    </div>
  )
}

export function RequestCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Shimmer className="w-11 h-11 shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-4 w-36" />
          <Shimmer className="h-3 w-28" />
        </div>
        <Shimmer className="w-8 h-8 shrink-0" />
      </div>
      <Shimmer className="h-9 w-full" />
    </div>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-4">
        <Shimmer className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-5 w-32" />
          <Shimmer className="h-3.5 w-44" />
          <Shimmer className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ToggleCardSkeleton() {
  return (
    <div className="bg-gray-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-28 bg-white/30" />
          <Shimmer className="h-7 w-36 bg-white/30" />
          <Shimmer className="h-2.5 w-52 bg-white/20" />
        </div>
        <Shimmer className="w-14 h-8 rounded-full bg-white/30" />
      </div>
    </div>
  )
}

export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
      <Shimmer className="w-10 h-10 shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-2.5 w-16" />
      </div>
    </div>
  )
}

export function InventoryGridSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-1">
          <Shimmer className="h-4 w-8" />
          <Shimmer className="h-7 w-10" />
          <Shimmer className="h-2.5 w-6" />
        </div>
      ))}
    </div>
  )
}
