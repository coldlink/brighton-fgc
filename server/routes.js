/**
 * Main application routes
 */

'use strict'

import errors from './components/errors'
import path from 'path'

export default function (app) {
  // Insert routes below
  app.use('/api/characters', require('./api/character'))
  app.use('/api/scores', require('./api/score'))
  app.use('/api/matches', require('./api/match'))
  app.use('/api/games', require('./api/game'))
  app.use('/api/series', require('./api/series'))
  app.use('/api/attendance', require('./api/attendance'))
  app.use('/api/tournaments', require('./api/tournament'))
  app.use('/api/events', require('./api/event'))
  app.use('/api/players', require('./api/player'))
  app.use('/api/users', require('./api/user'))
  app.use('/api/statistics', require('./api/statistics'))

  app.use('/auth', require('./auth').default)

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404])

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`))
    })
}
