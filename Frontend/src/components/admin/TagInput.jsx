import { useState } from 'react';
import { X } from 'lucide-react';

export function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    // Pasted lists (comma or newline separated) become separate tags instead of one giant tag.
    const parts = draft.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
    const next = [...value];
    parts.forEach((t) => { if (!next.includes(t)) next.push(t); });
    if (next.length !== value.length) onChange(next);
    setDraft('');
  };

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="input-field flex min-h-[2.75rem] flex-wrap items-center gap-1.5 !py-2">
      {value.map((v, idx) => (
        <span key={v + idx} className="flex items-center gap-1 rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-medium text-accent-700">
          {v}
          <button type="button" onClick={() => remove(idx)} aria-label={`Remove ${v}`}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
        placeholder={value.length ? '' : placeholder}
        className="min-w-[8rem] flex-1 border-none bg-transparent p-0 text-sm outline-none"
      />
    </div>
  );
}
