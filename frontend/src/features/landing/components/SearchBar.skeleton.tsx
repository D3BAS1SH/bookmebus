import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function SearchBarSkeleton() {
  return (
    <div className="bg-surface-container-low/50 border border-outline-variant/10 p-2 max-w-5xl mx-auto rounded-full">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex-1 px-6 py-3 flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-outline-variant/20" />
        <div className="flex-1 px-6 py-3 flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-outline-variant/20" />
        <div className="flex-1 px-6 py-3 flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="space-y-1 w-full">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-14 w-14 rounded-full md:ml-4 flex-shrink-0" />
      </div>
    </div>
  )
}
