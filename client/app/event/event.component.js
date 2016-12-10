'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './event.routes'

export class EventComponent {
  /* @ngInject */
  constructor ($http, $window, $timeout) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.pastEvents = []
    this.pastEventsChunk = []
    this.upcomingEvents = []
    this.upcomingEventsChunk = []
  }

  $onInit () {
    this.$http.get('/api/events')
      .then(response => {
        console.log(response.data)
        this.sortEvents(response.data)
      })
  }

  sortEvents (events) {
    events = events || this.events

    _.each(events, (v, i) => {
      if (new Date(v.date_time).getTime() < Date.now()) {
        this.pastEvents.push(v)
      } else {
        this.upcomingEvents.push(v)
      }
    })

    this.pastEvents = _.reverse(_.sortBy(this.pastEvents, o => new Date(o.date_time)))
    this.upcomingEvents = _.sortBy(this.upcomingEvents, o => new Date(o.date_time))
    this.pastEventsChunk = _.chunk(this.pastEvents, 3)
    this.upcomingEventsChunk = _.chunk(this.upcomingEvents, 3)

    this.$timeout(() => {
      this.$window.$('.match-height').matchHeight()
    }, 250)
  }
}

export class EventSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams, Util) {
    this.$http = $http
    this.$stateParams = $stateParams
    this.Util = Util
  }

  $onInit () {
    console.log(this)
    this.$http.get(`/api/events/${this.$stateParams.id}`)
      .then(response => {
        console.log(response.data)
        this.event = response.data
      })
  }

  getDateTime (dateTime) {
    return new Date(dateTime).getTime()
  }
}

export default angular.module('fgcApp.event', [uiRouter])
  .config(routes)
  .component('event', {
    template: require('./event.pug'),
    controller: EventComponent,
    controllerAs: 'eventCtrl'
  })
  .component('eventSingle', {
    template: require('./event.single.pug'),
    controller: EventSingleComponent,
    controllerAs: 'eventSingleCtrl'
  })
  .name
