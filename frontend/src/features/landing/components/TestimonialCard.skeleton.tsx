import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-ambient">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-8" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}
