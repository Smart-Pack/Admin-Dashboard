// src/router/guards.ts

import type { Router } from 'vue-router'

/**
 * @module router/guards
 * @description Sets up the global navigation guard that formats document titles.
 */

/**
 * Format a route name into a human-readable title.
 *
 * @param name - Route name to format.
 * @returns Formatted route title.
 */
const formatTitle = (name: string): string =>
  name ? name.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : ''

/**
 * Registers the global navigation guard used by every route transition.
 *
 * @param router - Vue Router instance.
 */
export function setupRouterGuard(router: Router): void {
  router.beforeEach((toRoute) => {
    document.title = toRoute.meta.title
      ? `${toRoute.meta.title} - SmartPack Admin`
      : toRoute.name
        ? `${formatTitle(String(toRoute.name))} - SmartPack Admin`
        : 'SmartPack Admin Dashboard'
  })
}
