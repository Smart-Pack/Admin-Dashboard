import { flushPromises, shallowMount } from '@vue/test-utils'
import Filters from '@/helpers/filters'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Assets from '@/components/Groups/Assets.vue'
import TablePageLayout from '@/components/Base/TablePageLayout.vue'
import api from '@/api'

const mocks = vi.hoisted(() => ({
  groupMembersList: vi.fn<typeof api.groupMembers.list>(),
  smartpacksList: vi.fn<typeof api.smartpacks.list>(),
}))

describe('GroupAssets', () => {
  const defaultProps = {
    groupId: 3,
    groupName: 'Family Group',
    refreshKey: '2026-10-12T08:00:00Z',
  }

  const mountAssets = async (props: Partial<typeof defaultProps> = {}) => {
    const wrapper = shallowMount(Assets, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        mocks: {
          $api: {
            groupMembers: {
              list: mocks.groupMembersList,
            },
            smartpacks: {
              list: mocks.smartpacksList,
            },
          },
        },
      },
    })

    await flushPromises()

    return wrapper
  }

  const getTable = (wrapper: Awaited<ReturnType<typeof mountAssets>>) =>
    wrapper.findComponent(TablePageLayout)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the Assets heading', async () => {
      const wrapper = await mountAssets()

      expect(wrapper.find('h3').text()).toBe('Assets')
    })

    it('displays the Users table by default', async () => {
      const wrapper = await mountAssets()
      const table = getTable(wrapper)

      expect(table.exists()).toBe(true)
      expect(table.props('name')).toBe('Users')
      expect(table.props('getter')).toBe(mocks.groupMembersList)
    })

    it('displays the Show SmartPacks button by default', async () => {
      const wrapper = await mountAssets()

      expect(wrapper.find('button').text()).toBe('Show SmartPacks')
    })

    it('passes the group members table description', async () => {
      const wrapper = await mountAssets()

      expect(getTable(wrapper).props('pageDescription')).toBe(
        'Members of Family Group, including their contact details and group roles.',
      )
    })

    it('passes the group ID to the member table filters', async () => {
      const wrapper = await mountAssets()
      const tabs = getTable(wrapper).props('tabs')

      expect(tabs).toEqual([
        {
          id: 'all',
          caption: 'All Group Members',
          label: 'All',
          params: {
            group: 3,
          },
        },
        {
          id: 'admins',
          caption: 'Group Admins',
          label: 'Admins',
          params: {
            group: 3,
            has_admin_access: true,
          },
        },
        {
          id: 'members',
          caption: 'Regular Group Members',
          label: 'Members',
          params: {
            group: 3,
            role: 'member',
          },
        },
      ])
    })

    it('passes the member table column headings', async () => {
      const wrapper = await mountAssets()
      const headings = getTable(wrapper).props('itemHeadings')

      expect(headings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'user.full_name',
            label: 'Full Name',
            sortable: false,
          }),
          expect.objectContaining({
            key: 'user.email',
            label: 'Email',
            sortable: false,
          }),
          expect.objectContaining({
            key: 'user.phone',
            label: 'Phone',
            sortable: false,
          }),
          expect.objectContaining({
            key: 'role',
            label: 'Group Role',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'created',
            label: 'Date Added',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'actions',
            label: 'Actions',
            sortable: false,
            action: {
              name: 'View',
              route: 'user-details',
              params: expect.any(Function),
            },
          }),
        ]),
      )
    })

    it('resolves the user-details route parameters using the member user ID', async () => {
      const wrapper = await mountAssets()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        action?: {
          params?: (item: { user: { id: number } }) => Record<string, number>
        }
      }>

      const actions = headings.find((heading) => heading.key === 'actions')

      expect(
        actions?.action?.params?.({
          user: { id: 42 },
        }),
      ).toEqual({ id: 42 })
    })

    it('passes the refresh key to the member table', async () => {
      const wrapper = await mountAssets()

      expect(getTable(wrapper).props('refreshKey')).toBe(defaultProps.refreshKey)
    })

    it('enables search for the member table', async () => {
      const wrapper = await mountAssets()

      expect(getTable(wrapper).props('enableSearch')).toBe(true)
    })

    it('uses the expected layout configuration for the member table', async () => {
      const wrapper = await mountAssets()

      expect(getTable(wrapper).props('navClass')).toBe('grid-cols-3 lg:text-base')
    })
  })

  describe('member headings', () => {
    it('formats group roles using Filters.capitalize', async () => {
      const wrapper = await mountAssets()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        formatter?: (value: unknown) => unknown
      }>

      const role = headings.find((heading) => heading.key === 'role')

      expect(role?.formatter?.('admin')).toBe('Admin')
      expect(role?.formatter?.('member')).toBe('Member')
      expect(role?.formatter?.(null)).toBe('')
    })

    it('formats the date added using Filters.dateTime', async () => {
      const wrapper = await mountAssets()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        formatter?: (value: unknown) => unknown
      }>

      const created = headings.find((heading) => heading.key === 'created')

      expect(created?.formatter?.('2026-10-01T08:00:00Z')).toBe(
        Filters.dateTime('2026-10-01T08:00:00Z'),
      )

      expect(created?.formatter?.(null)).toBe(Filters.dateTime(null))
    })

    it('uses the bold primary-text style for the member full name', async () => {
      const wrapper = await mountAssets()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        dataClass?: string
      }>

      expect(headings.find((heading) => heading.key === 'user.full_name')?.dataClass).toBe(
        'primary-text font-bold',
      )
    })
  })

  describe('switching between assets', () => {
    it('switches to the SmartPacks table when Show SmartPacks is clicked', async () => {
      const wrapper = await mountAssets()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      const table = getTable(wrapper)

      expect(table.props('name')).toBe('SmartPacks')
      expect(table.props('getter')).toBe(mocks.smartpacksList)
    })

    it('displays the Show Users button on the SmartPacks page', async () => {
      const wrapper = await mountAssets()

      await wrapper.find('button').trigger('click')

      expect(wrapper.find('button').text()).toBe('Show Users')
    })

    it('switches back to the Users table when Show Users is clicked', async () => {
      const wrapper = await mountAssets()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      const table = getTable(wrapper)

      expect(table.props('name')).toBe('Users')
      expect(table.props('getter')).toBe(mocks.groupMembersList)
    })
  })

  describe('SmartPacks table', () => {
    const showSmartPacks = async () => {
      const wrapper = await mountAssets()

      await wrapper.find('button').trigger('click')
      await flushPromises()

      return wrapper
    }

    it('passes the SmartPacks table description', async () => {
      const wrapper = await showSmartPacks()

      expect(getTable(wrapper).props('pageDescription')).toBe(
        'SmartPacks assigned to Family Group, with their connectivity and firmware details.',
      )
    })

    it('filters SmartPacks by group ID', async () => {
      const wrapper = await showSmartPacks()

      expect(getTable(wrapper).props('tabs')).toEqual([
        {
          id: 'all',
          caption: 'All Group SmartPacks',
          label: 'All',
          params: {
            group: 3,
          },
        },
      ])
    })

    it('passes the SmartPacks column headings', async () => {
      const wrapper = await showSmartPacks()
      const headings = getTable(wrapper).props('itemHeadings')

      expect(headings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'imei',
            label: 'IMEI',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'firmware_version',
            label: 'Firmware',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'is_online',
            label: 'Status',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'child_name',
            label: 'Child',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'created',
            label: 'Added',
            sortable: true,
          }),
          expect.objectContaining({
            key: 'actions',
            label: 'Actions',
            sortable: false,
            action: {
              name: 'View',
              route: 'smartpack-details',
            },
          }),
        ]),
      )
    })

    it('formats SmartPack connectivity status', async () => {
      const wrapper = await showSmartPacks()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        formatter?: (value: unknown) => unknown
      }>

      const status = headings.find((heading) => heading.key === 'is_online')

      expect(status?.formatter?.(true)).toBe('Online')
      expect(status?.formatter?.(false)).toBe('Offline')
      expect(status?.formatter?.(undefined)).toBe('Offline')
    })

    it('uses the expected connectivity status styling', async () => {
      const wrapper = await showSmartPacks()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        dataClass?: { fmt: (value: unknown) => unknown }
      }>

      const status = headings.find((heading) => heading.key === 'is_online')

      expect(status?.dataClass?.fmt(true)).toBeTruthy()
      expect(status?.dataClass?.fmt(false)).toBeTruthy()
    })

    it('uses the bold primary-text style for the IMEI', async () => {
      const wrapper = await showSmartPacks()
      const headings = getTable(wrapper).props('itemHeadings') as Array<{
        key: string
        dataClass?: string
      }>

      expect(headings.find((heading) => heading.key === 'imei')?.dataClass).toBe(
        'primary-text font-bold',
      )
    })

    it('passes the refresh key to the SmartPacks table', async () => {
      const wrapper = await showSmartPacks()

      expect(getTable(wrapper).props('refreshKey')).toBe(defaultProps.refreshKey)
    })

    it('enables search for the SmartPacks table', async () => {
      const wrapper = await showSmartPacks()

      expect(getTable(wrapper).props('enableSearch')).toBe(true)
    })

    it('uses the expected layout configuration for the SmartPacks table', async () => {
      const wrapper = await showSmartPacks()

      expect(getTable(wrapper).props('navClass')).toBe('grid-cols-1 lg:text-base')
    })
  })

  describe('props', () => {
    it('uses the supplied group name in the member description', async () => {
      const wrapper = await mountAssets({
        groupName: 'School Group',
      })

      expect(getTable(wrapper).props('pageDescription')).toBe(
        'Members of School Group, including their contact details and group roles.',
      )
    })

    it('uses the supplied group ID in the member filters', async () => {
      const wrapper = await mountAssets({
        groupId: 12,
      })

      const tabs = getTable(wrapper).props('tabs') as Array<{
        params: Record<string, unknown>
      }>

      expect(tabs.every((tab) => tab.params.group === 12)).toBe(true)
    })

    it('uses the supplied group name in the SmartPacks description', async () => {
      const wrapper = await mountAssets({
        groupName: 'Class Eight',
      })

      await wrapper.find('button').trigger('click')

      expect(getTable(wrapper).props('pageDescription')).toBe(
        'SmartPacks assigned to Class Eight, with their connectivity and firmware details.',
      )
    })

    it('updates the member table when the refresh key changes', async () => {
      const wrapper = await mountAssets()

      await wrapper.setProps({
        refreshKey: '2026-10-12T09:00:00Z',
      })

      expect(getTable(wrapper).props('refreshKey')).toBe('2026-10-12T09:00:00Z')
    })
  })

  describe('empty group', () => {
    it('does not render the member table when group ID is zero', async () => {
      const wrapper = await mountAssets({
        groupId: 0,
      })

      expect(getTable(wrapper).exists()).toBe(false)
    })

    it('does not render the SmartPacks table when group ID is zero', async () => {
      const wrapper = await mountAssets({
        groupId: 0,
      })

      await wrapper.find('button').trigger('click')

      expect(getTable(wrapper).exists()).toBe(false)
    })

    it('does not render either table when group ID is zero', async () => {
      const wrapper = await mountAssets({
        groupId: 0,
      })

      expect(getTable(wrapper).exists()).toBe(false)

      await wrapper.find('button').trigger('click')

      expect(getTable(wrapper).exists()).toBe(false)
    })
  })
})
