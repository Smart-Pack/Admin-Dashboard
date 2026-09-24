import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import UserDetails from '@/views/Users/details.vue'
import UserUpdateForm from '@/components/Users/UpdateForm.vue'
import MaleIcon from '@/components/Icons/MaleIcon.vue'
import FemaleIcon from '@/components/Icons/FemaleIcon.vue'
import { mockUser } from '@/tests/constants'
import type { User } from '@/api/modules/users'

const mockGetById = vi.fn<(params: { id: string }) => Promise<User>>()
const mockEdit =
  vi.fn<(payload: User, notify?: boolean) => Promise<{ data: User; message: string }>>()
const mockNotifyError = vi.fn<(message: string) => void>()
const mockNotifySuccess = vi.fn<(message: string) => void>()
const mockDeleteModal = vi.fn<(action: string, name: string) => Promise<boolean>>()
const mockRouterPush = vi.fn<(location: { name: string }) => void>()

const mockFilters = {
  capitalize: (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : ''),
  dateOnly: (value: string) => `dateOnly(${value})`,
  dateTime: (value: string) => `dateTime(${value})`,
}

const mountView = () =>
  mount(UserDetails, {
    global: {
      mocks: {
        $api: {
          users: {
            getById: mockGetById,
            edit: mockEdit,
          },
        },
        $filters: mockFilters,
        $notifyError: mockNotifyError,
        $notifySuccess: mockNotifySuccess,
        $deleteModal: mockDeleteModal,
        $route: {
          params: { id: mockUser.id.toString() },
        },
        $router: {
          push: mockRouterPush,
        },
      },
      stubs: {
        UserUpdateForm: true,
      },
    },
  })

describe('UserDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetById.mockResolvedValue(mockUser)
  })

  describe('fetching the user', () => {
    it('fetches the user by route id on mount', async () => {
      mountView()
      await flushPromises()

      expect(mockGetById).toHaveBeenCalledWith({ id: mockUser.id.toString() })
    })

    it('renders the fetched user details', async () => {
      const wrapper = mountView()
      await flushPromises()

      expect(wrapper.text()).toContain(`${mockUser.first_name} ${mockUser.last_name}`)
      expect(wrapper.text()).toContain(mockUser.email)
      expect(wrapper.text()).toContain(mockUser.phone)
    })

    it('notifies and redirects to users list when fetch fails with a reload error', async () => {
      mockGetById.mockRejectedValueOnce({ message: 'User not found', reload: true })

      mountView()
      await flushPromises()

      expect(mockNotifyError).toHaveBeenCalledWith('User not found')
      expect(mockRouterPush).toHaveBeenCalledWith({ name: 'users' })
    })

    it('notifies without redirecting when fetch fails without a reload flag', async () => {
      mockGetById.mockRejectedValueOnce({ message: 'Server error', reload: false })

      mountView()
      await flushPromises()

      expect(mockNotifyError).toHaveBeenCalledWith('Server error')
      expect(mockRouterPush).not.toHaveBeenCalled()
    })
  })

  describe('headingTitle', () => {
    it('capitalizes and joins account_type and role', async () => {
      const wrapper = mountView()
      await flushPromises()

      const expected = `${mockFilters.capitalize(mockUser.account_type)} ${mockFilters.capitalize(mockUser.role)}`
      expect(wrapper.text()).toContain(expected)
    })
  })

  describe('avatar rendering', () => {
    it('renders MaleIcon when gender is male and there is no profile_pic', async () => {
      mockGetById.mockResolvedValueOnce({ ...mockUser, gender: 'male', profile_pic: null })

      const wrapper = mountView()
      await flushPromises()

      expect(wrapper.findComponent(MaleIcon).exists()).toBe(true)
      expect(wrapper.findComponent(FemaleIcon).exists()).toBe(false)
    })

    it('renders FemaleIcon when gender is not male and there is no profile_pic', async () => {
      mockGetById.mockResolvedValueOnce({ ...mockUser, gender: 'female', profile_pic: null })

      const wrapper = mountView()
      await flushPromises()

      expect(wrapper.findComponent(FemaleIcon).exists()).toBe(true)
      expect(wrapper.findComponent(MaleIcon).exists()).toBe(false)
    })

    it('renders the profile picture instead of an icon when profile_pic is set', async () => {
      mockGetById.mockResolvedValueOnce({ ...mockUser, profile_pic: 'https://example.com/pic.jpg' })

      const wrapper = mountView()
      await flushPromises()

      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('https://example.com/pic.jpg')
      expect(wrapper.findComponent(MaleIcon).exists()).toBe(false)
      expect(wrapper.findComponent(FemaleIcon).exists()).toBe(false)
    })
  })

  describe('toggleUser', () => {
    it('does nothing if the confirmation modal is declined', async () => {
      mockDeleteModal.mockResolvedValueOnce(false)

      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.error-btn').trigger('click')
      await flushPromises()

      expect(mockEdit).not.toHaveBeenCalled()
    })

    it('asks to Suspend an active user and edits on confirmation', async () => {
      mockGetById.mockResolvedValueOnce({ ...mockUser, status: 'active' })
      mockDeleteModal.mockResolvedValueOnce(true)
      mockEdit.mockResolvedValueOnce({
        data: { ...mockUser, status: 'suspended' },
        message: 'User suspended',
      })

      const wrapper = mountView()
      await flushPromises()

      expect(wrapper.find('.error-btn').text()).toBe('Suspend')

      await wrapper.find('.error-btn').trigger('click')
      await flushPromises()

      expect(mockDeleteModal).toHaveBeenCalledWith(
        'Suspend',
        `${mockUser.first_name} ${mockUser.last_name}`,
      )
      expect(mockEdit).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }), true)
      expect(mockNotifySuccess).toHaveBeenCalledWith('User suspended')
    })

    it('asks to Activate a non-active user', async () => {
      mockGetById.mockResolvedValueOnce({ ...mockUser, status: 'suspended' })
      mockDeleteModal.mockResolvedValueOnce(true)
      mockEdit.mockResolvedValueOnce({
        data: { ...mockUser, status: 'active' },
        message: 'User activated',
      })

      const wrapper = mountView()
      await flushPromises()

      expect(wrapper.find('.error-btn').text()).toBe('Activate')

      await wrapper.find('.error-btn').trigger('click')
      await flushPromises()

      expect(mockDeleteModal).toHaveBeenCalledWith(
        'Activate',
        `${mockUser.first_name} ${mockUser.last_name}`,
      )
    })

    it('notifies and redirects when edit fails with a reload error', async () => {
      mockDeleteModal.mockResolvedValueOnce(true)
      mockEdit.mockRejectedValueOnce({ message: 'Edit failed', reload: true })

      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.error-btn').trigger('click')
      await flushPromises()

      expect(mockNotifyError).toHaveBeenCalledWith('Edit failed')
      expect(mockRouterPush).toHaveBeenCalledWith({ name: 'users' })
    })
  })

  describe('handlePageChange', () => {
    it('switches to the update panel and renders UserUpdateForm', async () => {
      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.form-submit').trigger('click')

      expect(wrapper.findComponent(UserUpdateForm).exists()).toBe(true)
    })

    it('re-fetches the user when refresh is true', async () => {
      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.form-submit').trigger('click') // switch to update panel first
      mockGetById.mockClear()

      await wrapper.findComponent(UserUpdateForm).vm.$emit('close', 'showDetails', true)
      await flushPromises()

      expect(mockGetById).toHaveBeenCalledWith({ id: mockUser.id.toString() })
    })

    it('does not re-fetch the user when refresh is false', async () => {
      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.form-submit').trigger('click') // switch to update panel first
      mockGetById.mockClear()

      await wrapper.findComponent(UserUpdateForm).vm.$emit('close', 'showDetails', false)
      await flushPromises()

      expect(mockGetById).not.toHaveBeenCalled()
    })

    it('returns to showDetails via the Cancel button', async () => {
      const wrapper = mountView()
      await flushPromises()

      await wrapper.find('.form-submit').trigger('click')
      expect(wrapper.findComponent(UserUpdateForm).exists()).toBe(true)

      await wrapper.find('.form-submit').trigger('click')
      expect(wrapper.findComponent(UserUpdateForm).exists()).toBe(false)
    })
  })
})
