import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '../index'

describe('useUiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addListener: vi.fn<() => void>(),
      removeListener: vi.fn<() => void>(),
      addEventListener: vi.fn<() => void>(),
      removeEventListener: vi.fn<() => void>(),
      dispatchEvent: vi.fn<() => void>(),
    }))
  })

  describe('initial state', () => {
    it('sets swalBackdrop to false', () => {
      const store = useUiStore()

      expect(store.swalBackdrop).toBe(false)
    })

    it('detects light mode from the system preference', () => {
      const store = useUiStore()

      expect(store.isLightMode).toBe(true)
    })
  })

  describe('getters', () => {
    it('returns the SweetAlert2 backdrop state', () => {
      const store = useUiStore()

      expect(store.getSwalBackdrop).toBe(false)

      store.swalBackdrop = true

      expect(store.getSwalBackdrop).toBe(true)
    })

    it('returns the current light mode state', () => {
      const store = useUiStore()

      expect(store.getIsLightMode).toBe(true)

      store.isLightMode = false

      expect(store.getIsLightMode).toBe(false)
    })
  })

  describe('actions', () => {
    it('updates the SweetAlert2 backdrop state', () => {
      const store = useUiStore()

      store.updateSwalBackdrop(true)

      expect(store.swalBackdrop).toBe(true)
      expect(store.getSwalBackdrop).toBe(true)
    })

    it('updates the light mode state', () => {
      const store = useUiStore()

      store.updateIsLightMode(false)

      expect(store.isLightMode).toBe(false)
      expect(store.getIsLightMode).toBe(false)
    })
  })
  it('detects dark mode from the system preference', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addListener: vi.fn<() => void>(),
      removeListener: vi.fn<() => void>(),
      addEventListener: vi.fn<() => void>(),
      removeEventListener: vi.fn<() => void>(),
      dispatchEvent: vi.fn<() => void>(),
    }))

    const store = useUiStore()

    expect(store.isLightMode).toBe(false)
  })
})
