/**
 * @module api/modules
 * @description Barrel export for API modules used by the dashboard.
 */

import * as auth from './auth'

const api = {
  auth,
}

export { auth }

export default api
