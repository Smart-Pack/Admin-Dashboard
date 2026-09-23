import { describe, expect, it } from 'vitest'

import { safeExternalHref } from '@/utils/urlSecurity'

describe('safeExternalHref', () => {
  it('returns a normalized https URL', () => {
    expect(safeExternalHref('https://example.com/path')).toBe('https://example.com/path')
  })

  it('returns a normalized http URL', () => {
    expect(safeExternalHref('http://example.com/path')).toBe('http://example.com/path')
  })

  it('trims whitespace from the URL', () => {
    expect(safeExternalHref('  https://example.com/path  ')).toBe('https://example.com/path')
  })

  it('normalizes the URL using the URL API', () => {
    expect(safeExternalHref('https://example.com:443/path')).toBe('https://example.com/path')
  })

  it('returns null for an empty string', () => {
    expect(safeExternalHref('')).toBeNull()
  })

  it('returns null for whitespace-only input', () => {
    expect(safeExternalHref('   ')).toBeNull()
  })

  it('returns null for a relative URL', () => {
    expect(safeExternalHref('/users/123')).toBeNull()
  })

  it('returns null for a malformed URL', () => {
    expect(safeExternalHref('not-a-valid-url')).toBeNull()
  })

  it('rejects javascript URLs', () => {
    expect(safeExternalHref('javascript:alert(1)')).toBeNull()
  })

  it('rejects data URLs', () => {
    expect(safeExternalHref('data:text/html,<h1>Hello</h1>')).toBeNull()
  })

  it('rejects blob URLs', () => {
    expect(safeExternalHref('blob:https://example.com/id')).toBeNull()
  })

  it('rejects file URLs', () => {
    expect(safeExternalHref('file:///etc/passwd')).toBeNull()
  })

  it('returns null for non-string values', () => {
    expect(safeExternalHref(null)).toBeNull()
    expect(safeExternalHref(undefined)).toBeNull()
    expect(safeExternalHref(123)).toBeNull()
    expect(safeExternalHref({})).toBeNull()
    expect(safeExternalHref([])).toBeNull()
  })

  it('accepts URLs with query parameters and fragments', () => {
    expect(safeExternalHref('https://example.com/users?page=2#details')).toBe(
      'https://example.com/users?page=2#details',
    )
  })

  it('rejects URLs with unsupported protocols', () => {
    expect(safeExternalHref('ftp://example.com/file')).toBeNull()
    expect(safeExternalHref('mailto:user@example.com')).toBeNull()
    expect(safeExternalHref('tel:+254700000000')).toBeNull()
  })
})
