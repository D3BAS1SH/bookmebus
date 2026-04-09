import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  blur?: 'sm' | 'md' | 'lg'
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, blur = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass rounded-xl shadow-ambient overflow-hidden',
          blur === 'sm' && 'backdrop-blur-sm',
          blur === 'md' && 'backdrop-blur-md',
          blur === 'lg' && 'backdrop-blur-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
