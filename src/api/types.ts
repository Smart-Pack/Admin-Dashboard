export interface ApiDetailResponse {
  detail: string
}

export interface Api {
  auth: typeof import('@/api/modules/auth')
  twoFactor: typeof import('@/api/modules/twoFactor')
  users: typeof import('@/api/modules/users')
}
