import apiClient from '@/api/client'
import { USERS } from '../endpoints'
import type { AxiosError } from 'axios'

type UpdatePasswordPayload = {
  current_password: string
  new_password: string
}

type PasswordErrorResponse = {
  current_password?: string[]
  detail?: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  profile_pic: string | null
  account_type: 'customer' | 'internal'
  role: 'staff' | 'admin'
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other'
  changed_password_after_initial_login: boolean
  created_at: string
  updated_at: string
  two_factor_enabled: boolean
  status: string
}

/**
 * Fetches information about the currently authenticated user.
 *
 * @returns The currently authenticated user's information.
 */
export const getMe = async () => {
  const response = await apiClient.get<User>(USERS.ME)
  return response.data
}

/**
 * Updates the authenticated user's password (used after they accept the terms).
 * Marks the initial-password flag as resolved so the user can continue into the dashboard.
 *
 * @param payload - Payload containing the current and new passwords.
 * @returns A promise resolving with a localized success message.
 * @throws The error is re-thrown after annotating messages for incorrect current
 * passwords or other validation failures.
 */
export const initialPassword = ({
  current_password,
  new_password,
}: UpdatePasswordPayload): Promise<string> => {
  const payload: UpdatePasswordPayload = {
    current_password,
    new_password,
  }

  return apiClient
    .post(USERS.INITIAL_PASSWORD, payload)
    .then(() => 'Password Changed successfully.')
    .catch((error: AxiosError<PasswordErrorResponse>) => {
      if (error.response?.status !== 400) {
        throw error
      }

      if (error.response.data?.current_password) {
        error.message = 'Current Password entered is incorrect.'
      }

      throw error
    })
}
