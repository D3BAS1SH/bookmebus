export function DriverTripsListSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Trips</h1>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          </div>
          <div className="flex gap-6">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
