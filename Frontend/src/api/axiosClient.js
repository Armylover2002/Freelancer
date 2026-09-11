import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const publicClient = axios.create({
  baseURL: `${baseURL}/public`,
  withCredentials: true,
  timeout: 15000,
});

export const adminClient = axios.create({
  baseURL: `${baseURL}/admin`,
  withCredentials: true,
  timeout: 15000,
});

function unwrap(promise) {
  return promise.then((res) => res.data.data);
}

function unwrapFull(promise) {
  return promise.then((res) => ({ data: res.data.data, meta: res.data.meta }));
}

/**
 * Turns a backend field path like "contact.email" or "design.referenceUrls.0"
 * into a readable label: "Contact / Email", "Design / Reference Urls".
 */
function humanizePath(path) {
  if (!path) return '';
  return path
    .split('.')
    .filter((segment) => !/^\d+$/.test(segment))
    .map((segment) => segment.replace(/([a-z])([A-Z])/g, '$1 $2'))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ');
}

export function extractErrorDetails(err) {
  return err?.response?.data?.error?.details || null;
}

/**
 * Always returns a message specific enough for the user to act on. When the backend
 * rejects a request with field-level validation `details` (see Backend middleware/validate.js),
 * the generic "Validation failed" wrapper message is replaced with the real per-field reason(s)
 * instead of being shown on its own.
 */
export function extractErrorMessage(err) {
  const base = err?.response?.data?.error?.message || err?.message || 'Something went wrong. Please try again.';
  const details = extractErrorDetails(err);

  if (Array.isArray(details) && details.length) {
    if (details.length === 1) {
      const { path, message } = details[0];
      return path ? `${humanizePath(path)}: ${message}` : message;
    }
    return details.map((d) => (d.path ? `${humanizePath(d.path)}: ${d.message}` : d.message)).join(' | ');
  }

  return base;
}

/**
 * Maps backend validation `details` onto a react-hook-form instance so the exact
 * field is highlighted with the real server message, not just a top-level toast.
 * Returns true if at least one field-level error was applied.
 */
export function applyServerErrors(err, setError) {
  const details = extractErrorDetails(err);
  if (!Array.isArray(details) || !details.length || typeof setError !== 'function') return false;

  let applied = false;
  details.forEach(({ path, message }) => {
    if (!path) return;
    setError(path, { type: 'server', message });
    applied = true;
  });
  return applied;
}

export { unwrap, unwrapFull };
