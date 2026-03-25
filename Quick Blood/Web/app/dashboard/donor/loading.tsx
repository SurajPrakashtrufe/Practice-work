import {
  StatCardSkeleton, ToggleCardSkeleton, RequestCardSkeleton,
} from "@/components/ui/skeleton-card"

export default function DonorHomeLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-pulse">
      {/* Greeting */}
      <div className="space-y-1.5">
        <div className="h-6 w-40 bg-gray-200 rounded-xl" />
        <div className="h-4 w-72 bg-gray-100 rounded-xl" />
      </div>
      <ToggleCardSkeleton />
      <div className="grid grid-cols-3 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded-xl" />
          <div className="h-2 bg-gray-100 rounded-full w-full" />
        </div>
        <div className="h-6 w-8 bg-gray-100 rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-36 bg-gray-200 rounded-xl" />
          <div className="h-4 w-12 bg-gray-100 rounded-xl" />
        </div>
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </div>
    </div>
  )
}
