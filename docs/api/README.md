# API

This section documents the API integration used by the SmartPack Admin Dashboard. It provides guidance on API configuration, client usage, authentication, and communication with the SmartPack backend.

## API Client

The Admin Dashboard uses Axios as its HTTP client. A dedicated Axios instance centralizes API communication and provides shared configuration such as the API base URL, JSON headers, request timeout, and credential support.

The API client is located at `src/api/client.ts` and is used as the foundation for service-specific API modules.

Further documentation will cover authentication, users, request/response handling, and other API services as they are implemented.

