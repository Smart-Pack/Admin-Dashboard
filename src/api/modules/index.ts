/**
 * @module api/modules
 * @description Barrel export for API modules used by the dashboard.
 */

import * as auth from './auth'
import * as twoFactor from './twoFactor'

const api = {
  auth,
  twoFactor,
}

export { auth, twoFactor }

export default api
