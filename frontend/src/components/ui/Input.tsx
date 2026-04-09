import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  rightElement?: React.ReactNode
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, label, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center gap-4 px-6 py-4 transition-all group bg-surface rounded-xl">
        {icon && (
          <div className="text-primary transition-transform group-focus-within:scale-110">
            {icon}
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          {label && (
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-60">
              {label}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'bg-transparent border-none p-0 text-on-surface font-semibold focus:ring-0 placeholder:text-outline-variant/60 w-full',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {rightElement && (
          <div className="text-outline-variant hover:text-primary transition-colors">
            {rightElement}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
