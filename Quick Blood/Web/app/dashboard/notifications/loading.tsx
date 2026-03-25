import { NotificationSkeleton } from "@/components/ui/skeleton-card"

export default function NotificationsLoading() {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="space-y-1.5">
        <div className="h-6 w-36 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded-xl animate-pulse" />
      </div>
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 animate-pulse">
        <div className="flex-1 h-9 bg-white rounded-lg shadow-sm" />
        <div className="flex-1 h-9 bg-transparent rounded-lg" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)}
      </div>
    </div>
  )
}
