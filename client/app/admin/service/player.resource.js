'use strict'

export function PlayerResource ($resource) {
  'ngInject'

  return $resource('/api/players/:id/:controller', {
    id: '@_id'
  }, {
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    }
  })
}
