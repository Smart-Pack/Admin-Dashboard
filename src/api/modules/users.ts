import apiClient from '@/api/client'
import { USERS } from '../endpoints'
import type { AxiosError } from 'axios'
import type { PaginatedResponse, PaginationQueryParams } from '@/api/types'

export type CreateUserPayload = {
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_pic?: string
  role: 'staff' | 'admin'
  date_of_birth?: string
  gender: 'male' | 'female' | 'other'
}

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

export type EditMePayload = {
  first_name: string
  last_name: string
  email: string
  phone: string
  profile_pic?: File
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
}

export interface UserListItem {
  id: number
  unique_id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  profile_pic: string | null
  account_type: 'customer' | 'internal'
  role: 'staff' | 'admin'
  gender: 'male' | 'female' | 'other'
  status: string
  created_at: string
}

export type UserListResult = PaginatedResponse<UserListItem>

export interface UserQueryParams extends PaginationQueryParams {
  account_type?: 'customer' | 'internal'
  is_active?: boolean
  role?: 'staff' | 'admin'
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

/**
 * Updates information about the currently authenticated user.
 *
 * @param payload - The user fields to update.
 * @returns The updated user's information.
 */
export const editMe = async (payload: EditMePayload): Promise<User> => {
  const formData = new FormData()

  formData.append('first_name', payload.first_name)
  formData.append('last_name', payload.last_name)
  formData.append('email', payload.email)
  formData.append('phone', payload.phone.replace(/\s+/g, ''))
  formData.append('date_of_birth', payload.date_of_birth)
  formData.append('gender', payload.gender)

  if (payload.profile_pic) {
    formData.append('profile_pic', payload.profile_pic)
  }

  const response = await apiClient.patch<User>(USERS.ME, formData)

  return response.data
}

/**
 * Sets a new password for the authenticated user.
 *
 * @param payload - The password update payload.
 * @param payload.current_password - The user's current password.
 * @param payload.new_password - The user's new password.
 * @returns A promise that resolves with a success message.
 */
export const setPassword = (payload: UpdatePasswordPayload): Promise<string> => {
  return apiClient.post(USERS.SET_PASSWORD, payload).then(() => 'Password Changed successfully.')
}

/**
 * Creates a new user.
 *
 * @param payload - The user data to create.
 * @param payload.first_name - The user's first name.
 * @param payload.last_name - The user's last name.
 * @param payload.email - The user's email address.
 * @param payload.phone - The user's phone number.
 * @param payload.profile_pic - Optional profile picture URL.
 * @param payload.role - The user's internal role.
 * @param payload.date_of_birth - Optional date of birth.
 * @param payload.gender - The user's gender.
 * @returns A promise resolving with the created user and a success message.
 */
export const add = async (payload: CreateUserPayload): Promise<{ data: User; message: string }> => {
  const response = await apiClient.post<User>(USERS.COLLECTION, payload)

  return {
    data: response.data,
    message: `${payload.first_name} ${payload.last_name} Successfully added`,
  }
}

/**
 * Fetches a paginated list of users.
 *
 * @param {UserQueryParams} [params] - Optional query parameters for filtering and pagination.
 * @returns {Promise<UserListResult>} A promise that resolves with the paginated user list.
 */
export const list = async (params?: UserQueryParams): Promise<UserListResult> => {
  const url = USERS.collectionWithQuery(params)
  const response = await apiClient.get<UserListResult>(url)
  return response.data
}
