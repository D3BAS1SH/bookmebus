import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed/80',
        secondary:
          'border-transparent bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed/80',
        destructive:
          'border-transparent bg-error-container text-on-error-container hover:bg-error-container/80',
        outline: 'text-on-surface border-outline-variant',
        success:
          'border-transparent bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
