# Authentication Store

## Overview

The authentication store manages the application's client-side authentication state using Pinia.

It provides a centralized place for the dashboard to access authentication information and perform authentication-related state operations.

## Responsibilities

The authentication store is responsible for:

- Maintaining the current access token.
- Maintaining the currently logged-in user's information.
- Orchestrating the login flow.
- Clearing authentication state when the user logs out or authentication fails.
- Refreshing the access token when required.
- Providing authentication state to components and other application modules.

## Structure

The authentication store is organized into separate modules:

```text
src/stores/modules/auth/
├── actions.ts
├── constants.ts
├── getters.ts
├── index.ts
└── state.ts
```

- **`state.ts`** — Defines the authentication state.
- **`constants.ts`** — Defines authentication-related constants, such as allowed account types.
- **`getters.ts`** — Provides access to derived or exposed state.
- **`actions.ts`** — Handles authentication-related state operations, including the login flow.
- **`index.ts`** — Defines and exports the Pinia authentication store.

## Store Usage

The store is exposed through the `useAuthStore` composable and can be used by Vue components and other application logic that requires authentication state.

The store works together with the API authentication and users modules to communicate with the backend.

## Authentication Flow

At a high level:

1. The user submits their email and password.
2. The authentication store calls the authentication API to authenticate the user.
3. On successful authentication, the store maintains the access token.
4. The store fetches and maintains the currently logged-in user's information.
5. The store validates that the user's account type is allowed to access the dashboard.
6. The store requests a two-factor authentication token.
7. The user completes two-factor authentication.
8. Application features use the store to access the authenticated user's state.
9. The store can refresh the access token when required.
10. Authentication state is cleared when the session becomes invalid or the user logs out.

## Related Modules

- **API authentication:** `src/api/modules/auth.ts`
- **API users:** `src/api/modules/users.ts`
- **Authentication store:** `src/stores/modules/auth/`
- **API client:** `src/api/client.ts`
