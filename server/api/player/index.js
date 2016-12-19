'use strict'

var express = require('express')
var controller = require('./player.controller')
const auth = require('../../auth/auth.service')
const cache = require('express-redis-cache')({ expire: 60 * 60 * 1 })

var router = express.Router()

router.get('/', cache.route(), controller.index)
router.get('/:id', cache.route(), controller.show)
router.post('/', auth.hasRole('admin'), controller.create)
router.put('/:id', auth.hasRole('admin'), controller.upsert)
router.patch('/:id', auth.hasRole('admin'), controller.patch)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)

router.get('/:id/statistics', controller.statistics)
router.get('/:id/statistics/:type/:typeId', controller.statisticsExtra)

router.get('/:playerId/vs/:opponentId', controller.headToHead)
router.get('/:playerId/vs/:opponentId/:type/:typeId', controller.headToHeadExtra)

module.exports = router
