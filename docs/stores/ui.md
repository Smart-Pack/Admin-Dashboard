# UI Store

## Overview

The UI store manages global user-interface state shared across the SmartPack Admin Dashboard.

It provides a centralized way for components and layouts to read and update UI-related state without maintaining duplicate local state.

## Responsibilities

The UI store is responsible for:

* Managing SweetAlert2 backdrop visibility.
* Tracking the active light/dark theme mode.
* Providing getters for accessing UI state.
* Providing actions for updating UI state.

## State

### `swalBackdrop`

Controls whether the global SweetAlert2 backdrop is active.

**Default:** `false`

### `isLightMode`

Tracks whether the application is currently using light mode.

The initial value is determined from the user's system color-scheme preference.

## Getters

The store exposes getters for accessing its state:

* `getSwalBackdrop` — Returns the current SweetAlert2 backdrop state.
* `getIsLightMode` — Returns whether light mode is currently active.

## Actions

The store provides actions for updating UI state:

* `updateSwalBackdrop(value)` — Updates the SweetAlert2 backdrop state.
* `updateIsLightMode(value)` — Updates the current theme mode.

## Usage

Components should access UI state through the Pinia store rather than maintaining duplicate global UI state locally.

```ts
import { useUiStore } from '@/stores'

const uiStore = useUiStore()
```

The store can then be used to read state through its getters and update state through its actions.

## Testing

The UI store has unit tests covering:

* Default state.
* System light-mode detection.
* System dark-mode detection.
* Getter behavior.
* SweetAlert2 backdrop updates.
* Theme mode updates.

Tests are located under:

```text
src/stores/modules/ui/__tests__/
```

Run the store tests with:

```bash
pnpm vitest run src/stores/modules/ui/__tests__/index.spec.ts
```

