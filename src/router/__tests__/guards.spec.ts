import { describe, expect, it, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setupRouterGuard } from '../guards'

describe('Router Guard', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/login',
          name: 'login',
          component: {},
          meta: { title: 'Login' },
        },
        {
          path: '/forgot-password',
          name: 'forgot-password',
          component: {},
        },
        {
          path: '/dashboard',
          component: {},
        },
      ],
    })

    setupRouterGuard(router)
  })

  describe('Document Title Management', () => {
    it('sets the title from route metadata', async () => {
      await router.push('/login')

      expect(document.title).toBe('Login - SmartPack Admin')
    })

    it('formats the route name when metadata title is unavailable', async () => {
      await router.push('/forgot-password')

      expect(document.title).toBe('Forgot Password - SmartPack Admin')
    })

    it('uses the default title when no metadata title or route name exists', async () => {
      await router.push('/dashboard')

      expect(document.title).toBe('SmartPack Admin Dashboard')
    })
  })
})
