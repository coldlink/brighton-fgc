'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('error', {
      url: '/error',
      template: '<error></error>',
      params: {error: null}
    })
}
