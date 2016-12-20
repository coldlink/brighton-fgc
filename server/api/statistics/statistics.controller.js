'use strict'

import Tournament from '../tournament/tournament.model'
import Match from '../match/match.model'
import Event from '../event/event.model'
import Player from '../player/player.model'

function respondWithResult (res, statusCode) {
  statusCode = statusCode || 200
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

function handleError (res, statusCode) {
  statusCode = statusCode || 500
  return function (err) {
    res.status(statusCode).send(err)
  }
}

export function index (req, res) {
  let proms = []

  // number of tournament
  proms.push(new Promise((resolve, reject) => {
    Tournament
      .find({}, '_id')
      .exec()
      .then(tournaments => resolve(tournaments.length))
      .catch(err => reject(err))
  }))

  // number of events
  proms.push(new Promise((resolve, reject) => {
    Event
      .find({}, '_id')
      .exec()
      .then(events => resolve(events.length))
      .catch(err => reject(err))
  }))

  // number of players
  proms.push(new Promise((resolve, reject) => {
    Player
      .find({}, '_id')
      .exec()
      .then(players => resolve(players.length))
      .catch(err => reject(err))
  }))

  // number of matches
  proms.push(new Promise((resolve, reject) => {
    Match
      .find({}, '_id')
      .exec()
      .then(matches => resolve(matches.length))
      .catch(err => reject(err))
  }))

  Promise
    .all(proms)
    .then(respondWithResult(res))
    .catch(handleError(res))
}
