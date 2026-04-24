'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function BoardingScannerSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-40" />
        <div className="w-10" />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-10 flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="mt-2 h-3 w-20" />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="flex border-b border-gray-100 p-2">
            <Skeleton className="h-12 flex-1 rounded-2xl m-1" />
            <Skeleton className="h-12 flex-1 rounded-2xl m-1" />
          </div>
          <div className="p-8 flex flex-col items-center">
            <Skeleton className="h-64 w-full max-w-md rounded-xl" />
            <Skeleton className="mt-6 h-4 w-48" />
          </div>
        </div>
      </main>
    </div>
  );
}
