import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Textarea = forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={clsx(
          'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error-300 focus-visible:ring-error-500',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
