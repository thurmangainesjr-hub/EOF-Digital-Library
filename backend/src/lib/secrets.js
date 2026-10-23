/**
 * Secret loading
 *
 * In production a missing secret stops the server instead of
 * silently falling back to a value that is public on GitHub.
 */

export function getSecret(name, devFallback) {
  const value = process.env[name];
  if (value) return value;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be set in production`);
  }

  console.warn(`[secrets] ${name} is not set; using a development-only fallback`);
  return devFallback;
}
