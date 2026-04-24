'use client';

import { Suspense } from 'react';
import { BoardingScanner } from '@/features/trips/components/BoardingScanner';
import { BoardingScannerSkeleton } from '@/features/trips/components/BoardingScanner.skeleton';

export default function DriverScanPage() {
  return (
    <Suspense fallback={<BoardingScannerSkeleton />}>
      <BoardingScanner />
    </Suspense>
  );
}
