const ALLOWED_EXTERNAL_URL_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * Returns a normalized http(s) URL for safe external navigation.
 * Rejects empty, malformed, relative, and dangerous schemes such as javascript:, data:, blob:, and file:.
 *
 * @param {unknown} value Candidate URL value.
 * @returns {string|null} Normalized URL when safe, otherwise null.
 */
export function safeExternalHref(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const candidate = value.trim()
  if (!candidate) return null

  try {
    const parsed = new URL(candidate)
    return ALLOWED_EXTERNAL_URL_PROTOCOLS.has(parsed.protocol) ? parsed.href : null
  } catch {
    return null
  }
}
