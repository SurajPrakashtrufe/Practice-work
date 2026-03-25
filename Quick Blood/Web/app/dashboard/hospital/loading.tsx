import { StatCardSkeleton, InventoryGridSkeleton, RequestCardSkeleton } from "@/components/ui/skeleton-card"

export default function HospitalHomeLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-1.5">
        <div className="h-6 w-40 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded-xl" />
          <div className="h-4 w-16 bg-gray-100 rounded-xl" />
        </div>
        <InventoryGridSkeleton />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-40 bg-gray-200 rounded-xl animate-pulse" />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </div>
    </div>
  )
}
