import type { RouteRecordRaw } from 'vue-router'

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
    ],
  },
]

export default routes
