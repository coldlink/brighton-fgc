'use strict'

export default function routes ($stateProvider) {
  'ngInject'

  $stateProvider
    .state('admin', {
      url: '/admin',
      template: require('./admin.pug'),
      controller: 'AdminController',
      controllerAs: 'admin'
    // authenticate: 'admin'
    })
    .state('admin.player', {
      url: '/player',
      template: require('./partials/player/admin.player.pug'),
      controller: 'AdminPlayerController',
      controllerAs: 'adminPlayer'
      // authenticate: 'admin'
    })
}
