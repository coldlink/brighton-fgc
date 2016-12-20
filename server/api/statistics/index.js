'use strict'

var express = require('express')
var controller = require('./statistics.controller')
const cache = require('express-redis-cache')({ expire: 60 * 60 * 1 })

var router = express.Router()
router.get(`/`, cache.route(), controller.index)

module.exports = router
