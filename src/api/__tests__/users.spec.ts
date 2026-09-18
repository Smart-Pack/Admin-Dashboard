import type { AxiosError, AxiosInstance } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import apiClient from '@/api/client'
import { USERS } from '@/api/endpoints'
import { editMe, getMe, initialPassword, type User } from '@/api/modules/users'

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn<AxiosInstance['get']>(),
    post: vi.fn<AxiosInstance['post']>(),
    patch: vi.fn<AxiosInstance['patch']>(),
  },
}))

describe('Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMe', () => {
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

  describe('editMe', () => {
    it('updates the currently authenticated user successfully', async () => {
      const payload = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone: '+254712345678',
        date_of_birth: '2000-01-01',
        gender: 'female' as const,
      }

      const updatedUser: User = {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+254712345678',
        profile_pic: null,
        account_type: 'customer',
        role: 'staff',
        date_of_birth: '2000-01-01',
        gender: 'female',
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-18T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      vi.mocked(apiClient.patch).mockResolvedValueOnce({
        data: updatedUser,
      } as never)

      const response = await editMe(payload)

      expect(apiClient.patch).toHaveBeenCalledTimes(1)

      const [url, formData] = vi.mocked(apiClient.patch).mock.calls[0]!

      expect(url).toBe(USERS.ME)
      expect(formData).toBeInstanceOf(FormData)

      expect((formData as FormData).get('first_name')).toBe('Jane')
      expect((formData as FormData).get('last_name')).toBe('Doe')
      expect((formData as FormData).get('email')).toBe('jane@example.com')
      expect((formData as FormData).get('phone')).toBe('+254712345678')
      expect((formData as FormData).get('date_of_birth')).toBe('2000-01-01')
      expect((formData as FormData).get('gender')).toBe('female')

      expect(response).toEqual(updatedUser)
    })

    it('includes the profile picture when provided', async () => {
      const profilePic = new File(['image'], 'profile.jpg', {
        type: 'image/jpeg',
      })

      const payload = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone: '+254712345678',
        date_of_birth: '2000-01-01',
        gender: 'female' as const,
        profile_pic: profilePic,
      }

      const updatedUser = {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+254712345678',
        profile_pic: 'https://example.com/profile.jpg',
        account_type: 'customer' as const,
        role: 'staff' as const,
        date_of_birth: '2000-01-01',
        gender: 'female' as const,
        changed_password_after_initial_login: true,
        created_at: '2026-09-15T12:33:13.497Z',
        updated_at: '2026-09-18T12:33:13.497Z',
        two_factor_enabled: true,
        status: 'active',
      }

      vi.mocked(apiClient.patch).mockResolvedValueOnce({
        data: updatedUser,
      } as never)

      await editMe(payload)

      const [, formData] = vi.mocked(apiClient.patch).mock.calls[0]!

      expect((formData as FormData).get('profile_pic')).toBe(profilePic)
    })

    it('uses the same endpoint as getMe', async () => {
      vi.mocked(apiClient.patch).mockResolvedValueOnce({
        data: {},
      } as never)

      const payload = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone: '+254712345678',
        date_of_birth: '2000-01-01',
        gender: 'female' as const,
      }

      await editMe(payload)

      expect(apiClient.patch).toHaveBeenCalledWith(USERS.ME, expect.any(FormData))
    })
  })

  describe('initialPassword', () => {
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
})
