import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const variants = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

export function Button({
  as: Component = 'button',
  variant = 'primary',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <Component
      className={clsx(variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Component>
  );
}
