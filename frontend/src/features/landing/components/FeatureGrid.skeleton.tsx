import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export function FeatureCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-10 rounded-3xl shadow-ambient">
      <Skeleton className="h-14 w-14 rounded-2xl mb-8" />
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export function FeatureGridSkeleton() {
  return (
    <section className="py-24 px-6 bg-surface-container-low/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-20 flex flex-col items-center">
          <Skeleton className="h-10 w-64 md:w-96" />
          <Skeleton className="h-4 w-48 md:w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <FeatureCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
