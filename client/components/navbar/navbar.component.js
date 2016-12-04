'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  }, {
    title: 'Series',
    state: 'series'
  }, {
    title: 'Events',
    state: 'event'
  }, {
    title: 'Tournaments',
    state: 'tournament'
  }, {
    title: 'Players',
    state: 'player'
  }, {
    title: 'Games',
    state: 'game'
  }];

  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
