'use strict'
/* eslint no-process-env:0 */

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/fgc-dev'
  },

  // Seed database on startup
  seedDB: true,

  stripe: process.env.STRIPE
}
