import React from 'react'
import { cn } from '@/lib/utils'
import { Compass } from 'lucide-react'

import Link from 'next/link'

export function Branding({ className, href = '/' }: { className?: string; href?: string | null }) {
  const content = (
    <div className={cn("flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl primary-gradient text-white shadow-ambient">
        <Compass className="h-6 w-6" />
      </div>
      <span className="text-xl font-display font-black tracking-tighter">
        Ethereal Voyager
      </span>
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}
