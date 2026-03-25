import { StatCardSkeleton, RequestCardSkeleton } from "@/components/ui/skeleton-card"

export default function PatientHomeLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-1.5">
        <div className="h-6 w-40 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
      <div className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 bg-blue-200 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-36 bg-blue-200 rounded-xl" />
          <div className="h-3 w-52 bg-blue-100 rounded-xl" />
        </div>
        <div className="w-5 h-5 bg-blue-200 rounded-full shrink-0" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-28 bg-gray-200 rounded-xl animate-pulse" />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </div>
    </div>
  )
}
