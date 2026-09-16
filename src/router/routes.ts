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
        meta: { title: 'Finalize Account' },
      },
    ],
  },
]

export default routes
