# API Interceptors

## Overview

API interceptors provide centralized request and response handling for the application's Axios API client.

They are responsible for:

* Attaching the access token to API requests.
* Handling successful responses.
* Detecting unauthorized (`401`) responses.
* Refreshing authentication when required.
* Retrying failed requests when appropriate.
* Preventing repeated authentication retries.

## Structure

```text
src/api/interceptors/
├── index.ts
├── handle401.ts
├── retryRequest.ts
└── __tests__/
```

* **`index.ts`** — Configures the Axios request and response interceptors.
* **`handle401.ts`** — Handles unauthorized responses and determines whether a request should be retried.
* **`retryRequest.ts`** — Refreshes the access token and retries the original request.
* **`__tests__/`** — Contains unit tests for the interceptor functionality.

## Authentication Flow

When an API request is made, the request interceptor adds the available access token to the `Authorization` header.

If a protected request returns `401 Unauthorized`, the interceptor handles the response by attempting to refresh the authentication token and retry the original request.

Authentication and two-factor endpoints are excluded from automatic token refresh.

## Related Modules

* **API client:** `src/api/client.ts`
* **Authentication store:** `src/stores/modules/auth/`
* **Authentication API:** `src/api/modules/auth.ts`
* **API endpoints:** `src/api/endpoints.ts`

