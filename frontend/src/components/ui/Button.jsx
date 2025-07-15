import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus-visible:ring-warning-500',
    error: 'bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-base'
  }

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button 