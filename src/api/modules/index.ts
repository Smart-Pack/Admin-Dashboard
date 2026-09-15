/**
 * @module api/modules
 * @description Barrel export for API modules used by the dashboard.
 */

import * as auth from './auth'
import * as twoFactor from './twoFactor'
import * as users from './users'

const api = {
  auth,
  twoFactor,
  users,
}

export { auth, twoFactor, users }

export default api
