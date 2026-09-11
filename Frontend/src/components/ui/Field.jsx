import clsx from 'clsx';

export function Label({ children, required }) {
  return (
    <label className="label">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p className="field-error">{children}</p>;
}

export function Input({ className, error, ...props }) {
  return <input className={clsx('input-field', error && 'border-red-400 focus:ring-red-500/20', className)} {...props} />;
}

export function Textarea({ className, error, rows = 4, ...props }) {
  return (
    <textarea rows={rows} className={clsx('input-field resize-none', error && 'border-red-400 focus:ring-red-500/20', className)} {...props} />
  );
}

export function Select({ className, error, children, ...props }) {
  return (
    <select className={clsx('input-field', error && 'border-red-400', className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={clsx('flex items-start gap-2.5 text-sm text-ink-900/80 cursor-pointer', className)}>
      <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-ink-900/25 text-accent-500 focus:ring-accent-500/30" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function FormField({ label, required, error, children }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
