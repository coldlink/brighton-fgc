'use strict'

const express = require('express')
const controller = require('./stripe.controller')

let router = express.Router()
router.post(`/`, controller.charge)

module.exports = router
