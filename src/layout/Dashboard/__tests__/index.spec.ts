import { beforeEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'

import DashboardLayout from '../index.vue'
import { useUiStore } from '@/stores'

const stubs = {
  TopBar: {
    name: 'TopBar',
    template: '<header data-testid="top-bar" />',
  },

  SideNav: {
    name: 'SideNav',
    template: '<nav data-testid="side-nav" />',
  },

  ContentHeader: {
    name: 'ContentHeader',
    template: '<header data-testid="content-header" />',
  },

  ContentFooter: {
    name: 'ContentFooter',
    template: '<footer data-testid="content-footer" />',
  },

  RouterView: {
    name: 'RouterView',
    template: '<div data-testid="router-view" />',
  },
}

describe('DashboardLayout', () => {
  let pinia: Pinia
  let uiStore: ReturnType<typeof useUiStore>

  const mountDashboardLayout = (): VueWrapper =>
    mount(DashboardLayout, {
      global: {
        plugins: [pinia],
        stubs,
      },
    })

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    uiStore = useUiStore(pinia)

    uiStore.swalBackdrop = false
    uiStore.isSideNavOpen = false
    uiStore.isLightMode = true

    document.documentElement.classList.remove('dark')
  })

  describe('rendering', () => {
    it('renders the dashboard layout components', () => {
      const wrapper = mountDashboardLayout()

      expect(wrapper.find('[data-testid="top-bar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="side-nav"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-header"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-footer"]').exists()).toBe(true)
    })

    it('does not render the notification backdrop when disabled', () => {
      const wrapper = mountDashboardLayout()

      expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(false)
    })

    it('renders the notification backdrop when enabled', () => {
      uiStore.swalBackdrop = true

      const wrapper = mountDashboardLayout()

      const backdrop = wrapper.find('div.fixed.inset-0[aria-hidden="true"]')

      expect(backdrop.exists()).toBe(true)
      expect(backdrop.classes()).toContain('z-[1040]')
    })

    it('does not render the side navigation backdrop when the side navigation is closed', () => {
      uiStore.isSideNavOpen = false

      const wrapper = mountDashboardLayout()

      expect(wrapper.find('div.fixed.inset-0.z-\\[40\\]').exists()).toBe(false)
    })

    it('renders the side navigation backdrop when the side navigation is open', () => {
      uiStore.isSideNavOpen = true

      const wrapper = mountDashboardLayout()

      const backdrop = wrapper.find('div.fixed.inset-0.z-\\[40\\]')

      expect(backdrop.exists()).toBe(true)
      expect(backdrop.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('initialization', () => {
    it('clears the notification backdrop on mount', () => {
      uiStore.swalBackdrop = true

      mountDashboardLayout()

      expect(uiStore.swalBackdrop).toBe(false)
    })

    it('closes the side navigation on mount', () => {
      uiStore.isSideNavOpen = true

      mountDashboardLayout()

      expect(uiStore.isSideNavOpen).toBe(false)
    })

    it('applies light mode on mount', () => {
      uiStore.isLightMode = true

      mountDashboardLayout()

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('applies dark mode on mount', () => {
      uiStore.isLightMode = false

      mountDashboardLayout()

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('theme synchronization', () => {
    it('adds the dark class when light mode changes to dark mode', async () => {
      const wrapper = mountDashboardLayout()

      uiStore.isLightMode = false

      await wrapper.vm.$nextTick()

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('removes the dark class when dark mode changes to light mode', async () => {
      uiStore.isLightMode = false

      const wrapper = mountDashboardLayout()

      expect(document.documentElement.classList.contains('dark')).toBe(true)

      uiStore.isLightMode = true

      await wrapper.vm.$nextTick()

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })
})
