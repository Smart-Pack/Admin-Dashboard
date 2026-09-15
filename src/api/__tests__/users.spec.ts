import type { AxiosInstance } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import apiClient from '@/api/client'
import { USERS } from '@/api/endpoints'
import { getMe, type User } from '@/api/modules/users'

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn<AxiosInstance['get']>(),
  },
}))

describe('Users API', () => {
  it('fetches the currently authenticated user', async () => {
    const user: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      profile_pic: null,
      account_type: 'customer',
      role: 'staff',
      date_of_birth: '2000-01-01',
      gender: 'male',
      changed_password_after_initial_login: true,
      created_at: '2026-09-15T12:33:13.497Z',
      updated_at: '2026-09-15T12:33:13.497Z',
      two_factor_enabled: true,
      status: 'active',
    }

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: user,
    } as never)

    const response = await getMe()

    expect(apiClient.get).toHaveBeenCalledWith(USERS.ME)
    expect(response).toEqual(user)
  })
})
