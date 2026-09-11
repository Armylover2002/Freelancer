// Admin-entered legal text follows a "Label – description" convention, one point per
// line (see Backend/src/models/SiteSettings.js `legal.privacyPolicy` / `termsOfService`).
// Rendering that as a single whitespace-pre-line block reads as one dense wall of text,
// so this splits it into clearly separated, labeled points instead.
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^([A-Za-z][\w\s&/'()-]{1,60}?)\s*[–—-]\s+(.+)$/);
  if (match) return { label: match[1].trim(), body: match[2].trim() };
  return { label: null, body: trimmed };
}

export function LegalContent({ text }) {
  const points = (text || '')
    .split('\n')
    .map(parseLine)
    .filter(Boolean);

  if (!points.length) return null;

  return (
    <ol className="space-y-3">
      {points.map((point, i) => (
        <li key={i} className="flex gap-3 rounded-xl border border-ink-900/8 bg-white px-4 py-3.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-xs font-bold text-accent-600">
            {i + 1}
          </span>
          <p className="text-sm leading-relaxed text-ink-900/75">
            {point.label && <span className="font-semibold text-ink-900">{point.label}: </span>}
            {point.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
