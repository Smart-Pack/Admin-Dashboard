import type { RouteRecordRaw } from 'vue-router'

/**
 * @module router/routes
 * @description Declares the application's Vue Router configuration, including dashboard/auth layouts,
 * nested feature routes for analytics, gateways, vouchers, sessions, content, users, SMEs, and the catch-all redirect.
 */

/**
 * Application routes.
 *
 * @type {RouteRecordRaw[]}
 */
const routes: RouteRecordRaw[] = [
  // Root redirect
  {
    path: '/',
    redirect: { name: 'dashboard' },
  },
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
    component: () => import('@/layout/Dashboard/index.vue'),
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
  // Fallback route for any unmatched URL so users land on the dashboard
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    redirect: (to) => ({
      name: 'dashboard',
      query: { redirect: to.fullPath },
    }),
  },
]

export default routes
