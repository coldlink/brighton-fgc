'use strict'

import angular from 'angular'
import routes from './admin.routes'
import AdminController from './admin.controller'
import AdminPlayerController from './partials/player/admin.player.controller'
import AdminUserController from './partials/user/admin.user.controller'
import { PlayerResource } from './service/player.resource'
import { UserResource } from './service/user.resource'
import uiSelect from 'ui-select'

export default angular.module('fgcApp.admin', ['fgcApp.auth', 'ui.router', 'ui.bootstrap', uiSelect])
  .config(routes)
  .factory('Player', PlayerResource)
  .factory('User', UserResource)
  .controller('AdminController', AdminController)
  .controller('AdminPlayerController', AdminPlayerController)
  .controller('AdminUserController', AdminUserController)
  .name
