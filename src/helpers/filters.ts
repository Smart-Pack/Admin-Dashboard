/**
 * @module helpers/filters
 * @description Global Vue filters for formatting router, session, voucher, user, and date/time values in templates.
 */
export default {
  /**
   * Returns dynamic Tailwind CSS classes for a status badge based on a boolean value.
   * @param {unknown} value - The actual value to check (e.g., `partner.is_active`).
   * @param {unknown} match - The value that should trigger the "active" style (e.g., `true`).
   * @returns {string} A string of Tailwind CSS classes for the badge.
   */
  statusClass(value: unknown, match: unknown): string {
    return value === match
      ? 'table-status-active py-1 px-2 text-sm'
      : 'table-status-inactive py-1 px-2 text-sm'
  },
}
