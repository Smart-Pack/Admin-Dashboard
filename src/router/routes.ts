import type { RouteRecordRaw } from 'vue-router'
import { RouterView } from 'vue-router'
import { h } from 'vue'

/**
 * @module router/routes
 * @description Declares the application's Vue Router configuration, including dashboard/auth layouts,
 * nested feature routes for analytics, gateways, vouchers, sessions, content, users, SMEs, and the catch-all redirect.
 */

/**
 * Dummy wrapper component for nested routes.
 * This lets us declare groups of child routes under a single parent without introducing additional layout markup.
 *
 * @returns {import('vue').VNode}
 */
const RouterViewWrapper = {
  name: 'RouterViewWrapper',
  render() {
    return h(RouterView)
  },
}

/**
 * Application routes.
 *
 * @type {RouteRecordRaw[]}
 */
const routes: RouteRecordRaw[] = [
  /**
   * Authentication routes.
   *
   * @type {RouteRecordRaw}
   */
  {
    path: '/auth',
    redirect: '/auth/login',
    component: () => import('@/layout/AuthLayout.vue'),
    children: [
      /**
       * Login page.
       *
       * @type {RouteRecordRaw}
       */
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Auth/Login.vue'),
      },
      // 2FA page
      {
        path: '2FA',
        name: '2fa',
        component: () => import('@/views/Auth/TwoFactor.vue'),
        meta: { title: '2FA' },
      },
      // Forgot password page
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/Auth/ForgotPassword.vue'),
      },
      // Reset password page
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/views/Auth/ResetPassword.vue'),
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('@/views/Auth/ChangePassword.vue'),
        meta: { requiresAuth: true, title: 'Finalize Account' },
      },
    ],
  },

  /**
   * Dashboard routes.
   *
   * @type {RouteRecordRaw}
   */
  {
    path: '/dashboard',
    component: RouterViewWrapper,
    meta: /** @type {AppRouteMeta} */ {
      breadcrumb: 'Home',
      requiresAuth: true,
    },
    children: [
      // Dashboard home
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { breadcrumb: 'Home', title: 'Home' },
      },
      {
        path: 'my-profile',
        name: 'my-profile',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { breadcrumb: 'My Profile', title: 'My Profile' },
      },
    ],
  },
]

export default routes
