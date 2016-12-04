'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

const _ = require('lodash');

import routes from './event.routes';

export class EventComponent {
  pastEvents = [];
  upcomingEvents = [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/players')
      .then(response => {
        console.log(response.data);
        this.sortEvents(response.data);
      });
  }

  sortEvents(events) {
    events = events || this.events;
    _.each(events, v => {
      if(new Date(v.date_time).getTime() < Date.now()) {
        this.pastEvents.push(v);
      } else {
        this.upcomingEvents.push(v);
      }
    });
  }
}

export default angular.module('fgcApp.event', [uiRouter])
  .config(routes)
  .component('event', {
    template: require('./event.pug'),
    controller: EventComponent,
    controllerAs: 'eventCtrl'
  })
  .name;
