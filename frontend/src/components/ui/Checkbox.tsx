import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          'h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer bg-surface',
          className
        )}
        {...props}
      />
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
