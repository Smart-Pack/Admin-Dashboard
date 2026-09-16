import type { AxiosError, AxiosInstance } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import apiClient from '@/api/client'
import { USERS } from '@/api/endpoints'
import { getMe, initialPassword, type User } from '@/api/modules/users'

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn<AxiosInstance['get']>(),
    post: vi.fn<AxiosInstance['post']>(),
  },
}))

describe('Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  it('updates the initial password successfully', async () => {
    const payload = {
      current_password: 'OldPassword123!',
      new_password: 'NewPassword123!',
    }

    vi.mocked(apiClient.post).mockResolvedValueOnce({} as never)

    const response = await initialPassword(payload)

    expect(apiClient.post).toHaveBeenCalledWith(USERS.INITIAL_PASSWORD, payload)
    expect(response).toBe('Password Changed successfully.')
  })

  it('sets an appropriate error message when the current password is incorrect', async () => {
    const payload = {
      current_password: 'WrongPassword123!',
      new_password: 'NewPassword123!',
    }

    const error = {
      response: {
        status: 400,
        data: {
          current_password: ['This password is incorrect.'],
        },
      },
      message: 'Request failed with status code 400',
    } as AxiosError<{
      current_password?: string[]
    }>

    vi.mocked(apiClient.post).mockRejectedValueOnce(error)

    await expect(initialPassword(payload)).rejects.toMatchObject({
      message: 'Current Password entered is incorrect.',
    })

    expect(apiClient.post).toHaveBeenCalledWith(USERS.INITIAL_PASSWORD, payload)
  })

  it('rethrows other 400 validation errors without changing the error message', async () => {
    const payload = {
      current_password: 'OldPassword123!',
      new_password: 'weak',
    }

    const error = {
      response: {
        status: 400,
        data: {
          new_password: ['This password is too weak.'],
        },
      },
      message: 'Request failed with status code 400',
    } as AxiosError<{
      current_password?: string[]
      new_password?: string[]
    }>

    vi.mocked(apiClient.post).mockRejectedValueOnce(error)

    await expect(initialPassword(payload)).rejects.toBe(error)

    expect(error.message).toBe('Request failed with status code 400')
  })

  it('rethrows non-400 errors', async () => {
    const payload = {
      current_password: 'OldPassword123!',
      new_password: 'NewPassword123!',
    }

    const error = {
      response: {
        status: 500,
        data: {
          detail: 'Internal server error',
        },
      },
      message: 'Request failed with status code 500',
    } as AxiosError

    vi.mocked(apiClient.post).mockRejectedValueOnce(error)

    await expect(initialPassword(payload)).rejects.toBe(error)

    expect(apiClient.post).toHaveBeenCalledWith(USERS.INITIAL_PASSWORD, payload)
  })
})
