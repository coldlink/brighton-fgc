'use strict'

import jQuery from 'jquery'

import angular from 'angular'
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies'
import ngResource from 'angular-resource'
import ngSanitize from 'angular-sanitize'

import uiRouter from 'angular-ui-router'
import uiBootstrap from 'angular-ui-bootstrap'
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';

import {
  routeConfig
} from './app.config'

import _Auth from '../components/auth/auth.module'
import account from './account'
import admin from './admin'
import navbar from '../components/navbar/navbar.component'
import footer from '../components/footer/footer.component'
import main from './main/main.component'
import constants from './app.constants'
import util from '../components/util/util.module'
import InfoComponent from './info/info.component'

import SeriesComponent from './series/series.component'
import TournamentComponent from './tournament/tournament.component'
import PlayerComponent from './player/player.component'
import GameComponent from './game/game.component'
import EventComponent from './event/event.component'
import ErrorComponent from './error/error.component'
import StreamComponent from './stream/stream.component'
import StatisticsComponent from './statistics/statistics.component'
import DonateComponent from './donate/donate.component'

import './app.scss'

angular.module('fgcApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, _Auth, account,
  admin, navbar, footer, main, constants, util, SeriesComponent, TournamentComponent, PlayerComponent, GameComponent, EventComponent, InfoComponent, StreamComponent, ErrorComponent, StatisticsComponent, DonateComponent
])
  .config(routeConfig)
  .run(function ($rootScope, $location, Auth, $window) {
    'ngInject'

    window.$ = jQuery
    window.jQuery = jQuery

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedIn(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login')
        }
      })
    })

    $rootScope.$on('$stateChangeSuccess', function () {
      $window.dataLayer.push({event: 'dynamicPageView'})
    })
  })

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['fgcApp'], {
      strictDi: true
    })
  })
