'use client'

import React from 'react'

export function TripTableSkeleton() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block bg-surface-container-lowest rounded-3xl shadow-ambient overflow-hidden">
        <div className="animate-pulse">
          <div className="border-b border-outline-variant/10 px-5 py-4 flex gap-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-surface-container-low rounded w-16" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-outline-variant/5 px-5 py-5 flex gap-8"
            >
              <div className="h-4 bg-surface-container-low rounded w-32" />
              <div className="h-4 bg-surface-container-low rounded w-24" />
              <div className="h-4 bg-surface-container-low rounded w-28" />
              <div className="h-4 bg-surface-container-low rounded w-14" />
              <div className="h-4 bg-surface-container-low rounded w-10 mx-auto" />
              <div className="h-5 bg-surface-container-low rounded-full w-20" />
              <div className="h-4 bg-surface-container-low rounded w-6 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-2xl shadow-ambient p-5 animate-pulse space-y-3"
          >
            <div className="flex justify-between">
              <div className="h-5 bg-surface-container-low rounded-full w-20" />
              <div className="h-6 bg-surface-container-low rounded w-6" />
            </div>
            <div className="h-4 bg-surface-container-low rounded w-3/4" />
            <div className="h-4 bg-surface-container-low rounded w-1/2" />
            <div className="h-4 bg-surface-container-low rounded w-2/3" />
          </div>
        ))}
      </div>
    </>
  )
}
