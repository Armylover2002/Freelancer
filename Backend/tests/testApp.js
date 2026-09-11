import './testEnv.js';

let cached = null;

/**
 * Lazily connects to the isolated test database and returns the Express app.
 * Env mutation in testEnv.js must run before app.js/config/env.js are first imported,
 * which is why these are dynamic imports rather than static ones.
 */
export async function getTestApp() {
  if (cached) return cached;
  const { connectDB } = await import('../src/config/db.js');
  const { app } = await import('../src/app.js');
  await connectDB();
  cached = { app };
  return cached;
}
