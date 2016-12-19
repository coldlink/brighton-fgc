'use strict'
/* eslint no-sync: 0 */

import angular from 'angular'

export class NavbarComponent {
  constructor (Auth) {
    'ngInject'

    this.menu = [{
      title: 'Home',
      state: 'main'
    }, {
      title: 'Info',
      state: 'info'
    }, {
      title: 'Series',
      state: 'series'
    }, {
      title: 'Events',
      state: 'event'
    }, {
      title: 'Tournaments',
      state: 'tournament'
    },
    /* {
      title: 'Players',
      state: 'player'
    }, */
    {
      title: 'Games',
      state: 'game'
    }, {
      title: 'Statistics',
      state: 'statistics'
    }, {
      title: 'Stream',
      state: 'stream'
    }]

    this.isCollapsed = true

    this.isLoggedIn = Auth.isLoggedInSync
    this.isAdmin = Auth.isAdminSync
    this.getCurrentUser = Auth.getCurrentUserSync
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name
