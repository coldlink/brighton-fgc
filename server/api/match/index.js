'use strict'

var express = require('express')
var controller = require('./match.controller')
const auth = require('../../auth/auth.service')
const cache = require('express-redis-cache')({ expire: 60 * 60 * 1 })

var router = express.Router()

router.get('/', cache.route(), controller.index)
router.get('/:id', cache.route(), controller.show)
router.post('/', auth.hasRole('admin'), controller.create)
router.put('/:id', auth.hasRole('admin'), controller.upsert)
router.patch('/:id', auth.hasRole('admin'), controller.patch)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)

module.exports = router
