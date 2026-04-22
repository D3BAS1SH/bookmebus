import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  icon?: React.ReactNode
  label?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon, label, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center gap-4 px-6 py-3 transition-all group bg-surface rounded-xl">
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
          <select
            ref={ref}
            className={cn(
              'bg-transparent border-none p-0 text-on-surface font-semibold focus:ring-0 w-full appearance-none cursor-pointer',
              !props.value && 'text-outline-variant/60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <ChevronDown className="h-4 w-4 text-on-surface-variant pointer-events-none" />
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
