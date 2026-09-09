import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import apiClient from '@/api/client'
import { AUTH } from '@/api/endpoints'
import { login, refresh, verify } from '@/api/modules/auth'

vi.mock('@/api/client', () => ({
  default: {
    post: vi.fn<AxiosInstance['post']>(),
  },
}))

/**
 * Tests the authentication API module.
 */
describe('auth API', () => {
  /**
   * Verifies that login sends the correct credentials to the login endpoint
   * and returns the API response.
   */
  it('logs in a user', async () => {
    const response = {
      data: {
        access: 'access-token',
        refresh: 'refresh-token',
      },
    }

    vi.mocked(apiClient.post).mockResolvedValue(response)

    const credentials = {
      email: 'user@example.com',
      password: 'password',
    }

    const result = await login(credentials)

    expect(apiClient.post).toHaveBeenCalledWith(AUTH.LOGIN, credentials)

    expect(result.data).toEqual(response.data)
  })
  it('refreshes authentication tokens using the refresh cookie', async () => {
    const response = {
      data: {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      },
    }

    vi.mocked(apiClient.post).mockResolvedValue(response)

    const result = await refresh()

    expect(apiClient.post).toHaveBeenCalledWith(AUTH.REFRESH)

    expect(result.data.access).toBe('new-access-token')
    expect(result.data.refresh).toBe('new-refresh-token')
  })
  it('verifies an authentication token', async () => {
    const response = {
      data: {},
    }

    vi.mocked(apiClient.post).mockResolvedValue(response)

    const payload = {
      token: 'access-token',
    }

    const result = await verify(payload)

    expect(apiClient.post).toHaveBeenCalledWith(AUTH.VERIFY, payload)
    expect(result.data).toEqual(response.data)
  })
})
