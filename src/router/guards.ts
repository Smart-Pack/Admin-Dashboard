// src/router/guards.ts

import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores'

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
 * Registers the global router guard.
 *
 * The guard manages document titles, authentication-based route access,
 * and the initial password-change requirement for authenticated users.
 *
 * Unauthenticated users can access public routes but are redirected to
 * the login page when attempting to access protected routes.
 *
 * Fully authenticated users are redirected to the dashboard when accessing
 * public routes. Users who have not changed their initial password are
 * required to access the change-password route before accessing other
 * protected routes.
 *
 * @param router - The Vue Router instance.
 * @param pinia - The Pinia instance used to access the authentication store.
 */
export function setupRouterGuard(router: Router, pinia: Pinia): void {
  const authStore = useAuthStore(pinia)

  router.beforeEach((toRoute) => {
    document.title = toRoute.meta.title
      ? `${toRoute.meta.title} - SmartPack Admin`
      : toRoute.name
        ? `${formatTitle(String(toRoute.name))} - SmartPack Admin`
        : 'SmartPack Admin Dashboard'

    if (!authStore.isFullyAuthenticated) {
      if (!toRoute.meta.requiresAuth) {
        return true
      }

      return {
        name: 'login',
        query: {
          redirect: toRoute.fullPath,
        },
      }
    }

    if (!toRoute.meta.requiresAuth) {
      return { name: 'dashboard' }
    }

    if (!authStore.hasChangedPassword && toRoute.name !== 'change-password') {
      return {
        name: 'change-password',
        query: {
          redirect: toRoute.fullPath,
        },
      }
    }

    if (authStore.hasChangedPassword && toRoute.name === 'change-password') {
      return { name: 'dashboard' }
    }

    return true
  })
}
