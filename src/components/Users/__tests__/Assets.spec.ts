import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Assets from '@/components/Users/Assets.vue'
import TablePageLayout, { type Getter } from '@/components/Base/TablePageLayout.vue'
import Filters from '@/helpers/filters'

const mockSmartPacksList = vi.fn<Getter>()
const mockGroupsList = vi.fn<Getter>()

type Heading = {
  key: string
  label?: string
  sortable?: boolean
  dataClass?: string | { fmt: (value: unknown) => unknown }
  formatter?: (value: unknown) => unknown
  action?: {
    name: string
    route: string
    params?: Record<string, unknown> | ((item: { id: number }) => Record<string, unknown>)
  }
}

type Tab = {
  id: string
  caption: string
  label: string
  params: Record<string, unknown>
}

const mountAssets = () =>
  mount(Assets, {
    props: {
      userId: 1,
      userName: 'Jane Doe',
    },
    global: {
      mocks: {
        $api: {
          smartpacks: {
            list: mockSmartPacksList,
          },
          groups: {
            list: mockGroupsList,
          },
        },
      },
      stubs: {
        TablePageLayout: true,
        RouterLink: true,
      },
    },
  })

const getActiveLayout = (wrapper: ReturnType<typeof mountAssets>) =>
  wrapper.findComponent(TablePageLayout)

const getHeadings = (): Heading[] => {
  const wrapper = mountAssets()
  return getActiveLayout(wrapper).props('itemHeadings') as Heading[]
}

const findHeading = (key: string): Heading | undefined =>
  getHeadings().find((heading) => heading.key === key)

describe('Assets', () => {
  describe('rendering', () => {
    it('renders a TablePageLayout for SmartPacks by default', () => {
      const wrapper = mountAssets()
      const layout = getActiveLayout(wrapper)

      expect(layout.exists()).toBe(true)
      expect(layout.props('name')).toBe('SmartPacks')
      expect(layout.props('getter')).toBe(mockSmartPacksList)
    })

    it('passes the SmartPack page description and layout configuration', () => {
      const wrapper = mountAssets()
      const layout = getActiveLayout(wrapper)

      expect(layout.props('pageDescription')).toContain(
        'SmartPacks assigned to Jane Doe, with their connectivity and firmware details.',
      )
      expect(layout.props('navClass')).toBe('grid-cols-1 lg:text-base')
      expect(layout.props('enableSearch')).toBe(true)
    })

    it('renders the Show Groups button initially', () => {
      const wrapper = mountAssets()

      expect(wrapper.text()).toContain('Show Groups')
      expect(wrapper.text()).not.toContain('Show SmartPacks')
    })

    it('passes the SmartPacks API getter', () => {
      const wrapper = mountAssets()

      expect(getActiveLayout(wrapper).props('getter')).toBe(mockSmartPacksList)
    })
  })

  describe('SmartPack tabs', () => {
    it('passes a single All tab', () => {
      const wrapper = mountAssets()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs).toHaveLength(1)
      expect(tabs[0]).toMatchObject({
        id: 'all',
        caption: 'All SmartPacks',
        label: 'All',
      })
    })

    it('passes the user ID as a filter for the All tab', () => {
      const wrapper = mountAssets()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs.find((tab) => tab.id === 'all')?.params).toEqual({
        assigned_to: 1,
      })
    })
  })

  describe('SmartPack headings', () => {
    it('passes seven column headings', () => {
      expect(getHeadings()).toHaveLength(7)
      expect(getHeadings().map((heading) => heading.key)).toEqual([
        'imei',
        'hardware_model',
        'firmware_version',
        'is_online',
        'assigned_to',
        'created',
        'actions',
      ])
    })

    it('uses the expected column labels', () => {
      expect(getHeadings().map((heading) => heading.label)).toEqual([
        'IMEI',
        'Hardware Model',
        'Firmware',
        'Status',
        'Assigned To',
        'Added',
        'Actions',
      ])
    })

    it('marks hardware_model with the bold primary-text dataClass', () => {
      expect(findHeading('hardware_model')?.dataClass).toBe('primary-text font-bold')
    })

    it('formats is_online as Online or Offline', () => {
      const isOnline = findHeading('is_online')

      expect(isOnline?.formatter?.(true)).toBe('Online')
      expect(isOnline?.formatter?.(false)).toBe('Offline')
    })

    it('styles is_online using Filters.activeClass', () => {
      const dataClass = findHeading('is_online')?.dataClass as {
        fmt: (value: unknown) => unknown
      }

      expect(dataClass.fmt(true)).toBe(Filters.activeClass(true))
      expect(dataClass.fmt(false)).toBe(Filters.activeClass(false))
      expect(dataClass.fmt(undefined)).toBe(Filters.activeClass(false))
    })

    it('formats assigned_to using the assigned user full name', () => {
      const assignedTo = findHeading('assigned_to')

      expect(
        assignedTo?.formatter?.({
          id: 1,
          uuid: 'abc-123',
          full_name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+254712345678',
        }),
      ).toBe('Jane Doe')

      expect(assignedTo?.formatter?.(null)).toBe('Unassigned')
    })

    it('formats created using Filters.dateTime', () => {
      const created = findHeading('created')

      expect(created?.formatter?.('2026-09-23T14:30:00Z')).toBe(
        Filters.dateTime('2026-09-23T14:30:00Z'),
      )
      expect(created?.formatter?.(null)).toBe(Filters.dateTime(null))
    })

    it('marks all columns sortable except actions', () => {
      const headings = getHeadings()

      expect(headings.filter((heading) => heading.sortable).map((heading) => heading.key)).toEqual([
        'imei',
        'hardware_model',
        'firmware_version',
        'is_online',
        'assigned_to',
        'created',
      ])

      expect(headings.filter((heading) => !heading.sortable).map((heading) => heading.key)).toEqual(
        ['actions'],
      )
    })

    it('configures the actions column to route to smartpack-details', () => {
      expect(findHeading('actions')?.action).toEqual({
        name: 'View',
        route: 'smartpack-details',
      })
    })
  })

  describe('Group view', () => {
    const showGroups = async () => {
      const wrapper = mountAssets()

      await wrapper.get('button').trigger('click')

      return wrapper
    }

    it('switches to the Groups table when Show Groups is clicked', async () => {
      const wrapper = await showGroups()
      const layout = getActiveLayout(wrapper)

      expect(layout.exists()).toBe(true)
      expect(layout.props('name')).toBe('Groups')
      expect(layout.props('getter')).toBe(mockGroupsList)
      expect(wrapper.text()).toContain('Show SmartPacks')
    })

    it('passes the expected Groups description and layout configuration', async () => {
      const wrapper = await showGroups()
      const layout = getActiveLayout(wrapper)

      expect(layout.props('pageDescription')).toBe(
        'Groups associated with this user, including group ownership, membership, and assigned SmartPacks.',
      )
      expect(layout.props('navClass')).toBe('grid-cols-3 lg:text-base')
      expect(layout.props('enableSearch')).toBe(true)
    })

    it('provides All, Owner, and Member tabs', async () => {
      const wrapper = await showGroups()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs).toHaveLength(3)
      expect(tabs.map(({ id, caption, label }) => ({ id, caption, label }))).toEqual([
        { id: 'all', caption: 'All Groups', label: 'All' },
        { id: 'owner', caption: 'Groups Owned by User', label: 'Owner' },
        { id: 'member', caption: 'Groups Where User Is a Member', label: 'Member' },
      ])
    })

    it('filters all groups by the selected user ID', async () => {
      const wrapper = await showGroups()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs.find((tab) => tab.id === 'all')?.params).toEqual({
        member: 1,
      })
    })

    it('filters owned groups by the selected user and owner role', async () => {
      const wrapper = await showGroups()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs.find((tab) => tab.id === 'owner')?.params).toEqual({
        member: 1,
        role: 'owner',
      })
    })

    it('filters member groups by the selected user and member role', async () => {
      const wrapper = await showGroups()
      const tabs = getActiveLayout(wrapper).props('tabs') as Tab[]

      expect(tabs.find((tab) => tab.id === 'member')?.params).toEqual({
        member: 1,
        role: 'member',
      })
    })

    it('passes five group column headings', async () => {
      const wrapper = await showGroups()
      const headings = getActiveLayout(wrapper).props('itemHeadings') as Heading[]

      expect(headings).toHaveLength(5)
      expect(headings.map((heading) => heading.key)).toEqual([
        'name',
        'total_users',
        'total_smartpacks',
        'created',
        'actions',
      ])
    })

    it('uses the expected group column labels', async () => {
      const wrapper = await showGroups()
      const headings = getActiveLayout(wrapper).props('itemHeadings') as Heading[]

      expect(headings.map((heading) => heading.label)).toEqual([
        'Group Name',
        'Total Users',
        'Total SmartPacks',
        'Created',
        'Actions',
      ])
    })

    it('marks the group name with the bold primary-text dataClass', async () => {
      const wrapper = await showGroups()
      const headings = getActiveLayout(wrapper).props('itemHeadings') as Heading[]

      expect(headings.find((heading) => heading.key === 'name')?.dataClass).toBe(
        'primary-text font-bold',
      )
    })

    it('formats the created date using Filters.dateTime', async () => {
      const wrapper = await showGroups()
      const headings = getActiveLayout(wrapper).props('itemHeadings') as Heading[]
      const created = headings.find((heading) => heading.key === 'created')

      expect(created?.formatter?.('2026-10-01T08:00:00Z')).toBe(
        Filters.dateTime('2026-10-01T08:00:00Z'),
      )
      expect(created?.formatter?.(null)).toBe(Filters.dateTime(null))
    })

    it('configures the actions column to route to group-details', async () => {
      const wrapper = await showGroups()
      const headings = getActiveLayout(wrapper).props('itemHeadings') as Heading[]

      expect(headings.find((heading) => heading.key === 'actions')?.action).toEqual({
        name: 'View',
        route: 'group-details',
      })
    })

    it('switches back to SmartPacks when Show SmartPacks is clicked', async () => {
      const wrapper = await showGroups()

      await wrapper.get('button').trigger('click')

      const layout = getActiveLayout(wrapper)

      expect(layout.props('name')).toBe('SmartPacks')
      expect(layout.props('getter')).toBe(mockSmartPacksList)
      expect(wrapper.text()).toContain('Show Groups')
    })
  })
})
