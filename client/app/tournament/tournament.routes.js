'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('tournament', {
      url: '/tournament',
      template: '<tournament></tournament>'
    })
    .state('tournamentSingle', {
      url: '/tournament/:id',
      template: '<tournament-single></tournament-single>'
    })
}
