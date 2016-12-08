'use strict'

var express = require('express')
var controller = require('./score.controller')
const auth = require('../../auth/auth.service')

var router = express.Router()

router.get('/', controller.index)
router.get('/:id', controller.show)
router.get('/series/top/:_id', controller.topBySeries)
router.post('/', auth.hasRole('admin'), controller.create)
router.put('/:id', auth.hasRole('admin'), controller.upsert)
router.patch('/:id', auth.hasRole('admin'), controller.patch)
router.delete('/:id', auth.hasRole('admin'), controller.destroy)

module.exports = router
