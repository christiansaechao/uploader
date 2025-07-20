import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Select = forwardRef(
  ({ children, className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={clsx(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-300 focus-visible:ring-error-500',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
