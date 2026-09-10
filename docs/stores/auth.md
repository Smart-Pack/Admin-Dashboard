# Authentication Store

## Overview

The authentication store manages the application's client-side authentication state using Pinia.

It provides a centralized place for the dashboard to access authentication information and perform authentication-related state operations.

## Responsibilities

The authentication store is responsible for:

* Maintaining the current access token.
* Clearing authentication state when the user logs out or authentication fails.
* Refreshing the access token when required.
* Providing authentication state to components and other application modules.

## Structure

The authentication store is organized into separate modules:

```text
src/stores/modules/auth/
├── actions.ts
├── getters.ts
├── index.ts
└── state.ts
```

* **`state.ts`** — Defines the authentication state.
* **`getters.ts`** — Provides access to derived or exposed state.
* **`actions.ts`** — Handles authentication-related state operations.
* **`index.ts`** — Defines and exports the Pinia authentication store.

## Store Usage

The store is exposed through the `useAuthStore` composable and can be used by Vue components and other application logic that requires authentication state.

The store works together with the API authentication module to communicate with the backend.

## Authentication Flow

At a high level:

1. The user authenticates through the authentication API.
2. The authentication store receives and maintains the access token.
3. Application features use the store to determine the current authentication state.
4. The store can refresh the access token when required.
5. Authentication state is cleared when the session becomes invalid or the user logs out.

## Related Modules

* **API authentication:** `src/api/modules/auth.ts`
* **Authentication store:** `src/stores/modules/auth/`
* **API client:** `src/api/client.ts`

