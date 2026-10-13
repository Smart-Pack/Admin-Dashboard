import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import GroupDetails from '@/views/Groups/details.vue'
import GroupAssets from '@/components/Groups/Assets.vue'

import type { GroupDetail } from '@/api/modules/groups'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type GroupIdParams = {
  id: string
}

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  getById: vi.fn<(params: GroupIdParams) => Promise<GroupDetail>>(),
  notifyError: vi.fn<(message: string) => void>(),
  routerPush: vi.fn<(location: { name: string }) => Promise<unknown>>(),
  dateTime: vi.fn<(value: string) => string>(),
}))

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

const mockGroup = {
  id: 7,
  name: 'Family Group',
  created: '2026-10-01T08:00:00Z',
  updated: '2026-10-10T08:00:00Z',
  members: [
    {
      id: 1,
      role: 'owner',
      user: {
        id: 10,
        full_name: 'Trevor Muriuki',
      },
    },
    {
      id: 2,
      role: 'admin',
      user: {
        id: 11,
        full_name: 'Jane Doe',
      },
    },
    {
      id: 3,
      role: 'member',
      user: {
        id: 12,
        full_name: 'John Doe',
      },
    },
  ],
  smartpacks: [
    {
      id: 101,
      hardware_model: 'SmartPack V1',
    },
  ],
} as unknown as GroupDetail

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const mountGroupDetails = async (routeId = '7'): Promise<VueWrapper> => {
  const wrapper = shallowMount(GroupDetails, {
    global: {
      mocks: {
        $api: {
          groups: {
            getById: mocks.getById,
          },
        },
        $notifyError: mocks.notifyError,
        $router: {
          push: mocks.routerPush,
        },
        $route: {
          params: {
            id: routeId,
          },
        },
        $filters: {
          dateTime: mocks.dateTime,
        },
      },
    },
  })

  await flushPromises()

  return wrapper
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('GroupDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.getById.mockResolvedValue(mockGroup)
    mocks.routerPush.mockResolvedValue(undefined)

    mocks.dateTime.mockImplementation((value) => `Formatted: ${value}`)
  })

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  describe('rendering', () => {
    it('renders the group details', async () => {
      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('Family Group')
      expect(wrapper.text()).toContain('Details')
      expect(wrapper.text()).toContain('Group Name')
      expect(wrapper.text()).toContain('Owner')
      expect(wrapper.text()).toContain('Created')
    })

    it('displays the group owner', async () => {
      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('Trevor Muriuki')
    })

    it('displays the total number of users', async () => {
      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('Users')
    })

    it('uses the singular User label when there is one member', async () => {
      mocks.getById.mockResolvedValueOnce({
        ...mockGroup,
        members: [mockGroup.members![0]],
      } as GroupDetail)

      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('User')
      expect(wrapper.text()).not.toContain('1 Users')
    })

    it('displays the total number of SmartPacks', async () => {
      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('1')
      expect(wrapper.text()).toContain('SmartPack')
    })

    it('formats the group creation timestamp', async () => {
      const wrapper = await mountGroupDetails()

      expect(mocks.dateTime).toHaveBeenCalledExactlyOnceWith(mockGroup.created)
      expect(wrapper.text()).toContain(`Formatted: ${mockGroup.created}`)
    })

    it('displays a placeholder when no owner is assigned', async () => {
      mocks.getById.mockResolvedValueOnce({
        ...mockGroup,
        members: mockGroup.members!.filter((member) => member.role !== 'owner'),
      } as GroupDetail)

      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('No owner assigned')
    })

    it('displays a fallback group name when the name is empty', async () => {
      mocks.getById.mockResolvedValueOnce({
        ...mockGroup,
        name: '',
      } as GroupDetail)

      const wrapper = await mountGroupDetails()

      expect(wrapper.text()).toContain('Group')
    })

    it('renders the GroupAssets component for a loaded group', async () => {
      const wrapper = await mountGroupDetails()
      const assets = wrapper.findComponent(GroupAssets)

      expect(assets.exists()).toBe(true)
      expect(assets.props('groupId')).toBe(mockGroup.id)
      expect(assets.props('groupName')).toBe(mockGroup.name)
      expect(assets.props('refreshKey')).toBe(mockGroup.updated)
    })
  })

  // ---------------------------------------------------------------------------
  // Fetching group details
  // ---------------------------------------------------------------------------

  describe('getGroup', () => {
    it('fetches group details using the route ID', async () => {
      await mountGroupDetails('25')

      expect(mocks.getById).toHaveBeenCalledExactlyOnceWith({
        id: '25',
      })
    })

    it('shows an error notification when fetching fails', async () => {
      mocks.getById.mockRejectedValueOnce(new Error('Failed to load group'))

      await mountGroupDetails()

      expect(mocks.notifyError).toHaveBeenCalledExactlyOnceWith('Failed to load group')
    })

    it('redirects to the groups list when the error requires a reload', async () => {
      mocks.getById.mockRejectedValueOnce(
        Object.assign(new Error('Group not found'), {
          reload: true,
        }),
      )

      await mountGroupDetails()

      expect(mocks.notifyError).toHaveBeenCalledExactlyOnceWith('Group not found')
      expect(mocks.routerPush).toHaveBeenCalledExactlyOnceWith({
        name: 'groups',
      })
    })
  })

  // ---------------------------------------------------------------------------
  // Group assets
  // ---------------------------------------------------------------------------

  describe('group assets', () => {
    it('passes the group ID to GroupAssets', async () => {
      const wrapper = await mountGroupDetails()
      const assets = wrapper.findComponent(GroupAssets)

      expect(assets.props('groupId')).toBe(7)
    })

    it('passes the group name to GroupAssets', async () => {
      const wrapper = await mountGroupDetails()
      const assets = wrapper.findComponent(GroupAssets)

      expect(assets.props('groupName')).toBe('Family Group')
    })

    it('passes the group updated timestamp as the refresh key', async () => {
      const wrapper = await mountGroupDetails()
      const assets = wrapper.findComponent(GroupAssets)

      expect(assets.props('refreshKey')).toBe('2026-10-10T08:00:00Z')
    })

    it('does not render GroupAssets when the group has no ID', async () => {
      mocks.getById.mockResolvedValueOnce({
        ...mockGroup,
        id: 0,
      } as GroupDetail)

      const wrapper = await mountGroupDetails()

      expect(wrapper.findComponent(GroupAssets).exists()).toBe(false)
    })
  })
})
