'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('fgcApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
