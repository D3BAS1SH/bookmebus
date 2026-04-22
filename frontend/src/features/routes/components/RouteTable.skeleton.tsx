import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function RouteTableSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden md:block bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/10">
              {['Route', 'Origin', 'Destination', 'Stops', 'Distance', 'Duration', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-6 py-4"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-outline-variant/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-5 w-8 rounded-lg mx-auto" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-14 mx-auto" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-14 mx-auto" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-6 rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
