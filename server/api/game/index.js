'use strict'

var express = require('express')
var controller = require('./game.controller')
const auth = require('../../auth/auth.service')
const cache = require('express-redis-cache')({ expire: 60 * 60 * 1 })

var router = express.Router()

router.get('/', cache.route(), controller.index)
router.get('/min', cache.route(), controller.indexMin)
router.get('/names', cache.route(), controller.getName)
router.get('/:id', cache.route(), controller.show)
router.post('/', auth.hasRole('admin'), controller.create)
router.put('/:id', auth.hasRole('admin'), controller.upsert)
router.patch('/:id', auth.hasRole('admin'), controller.patch)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)

module.exports = router
