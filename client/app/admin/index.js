'use strict'

import angular from 'angular'
import routes from './admin.routes'
import AdminController from './admin.controller'
import AdminPlayerController from './partials/player/admin.player.controller'
import { PlayerResource } from './service/player.resource'
import uiSelect from 'ui-select'

console.log(uiSelect)

export default angular.module('fgcApp.admin', ['fgcApp.auth', 'ui.router', 'ui.bootstrap', uiSelect])
  .config(routes)
  .factory('Player', PlayerResource)
  .controller('AdminController', AdminController)
  .controller('AdminPlayerController', AdminPlayerController)
  .name
