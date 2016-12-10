/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/series              ->  index
 * POST    /api/series              ->  create
 * GET     /api/series/:id          ->  show
 * PUT     /api/series/:id          ->  upsert
 * PATCH   /api/series/:id          ->  patch
 * DELETE  /api/series/:id          ->  destroy
 */

'use strict'

import jsonpatch from 'fast-json-patch'
import Series from './series.model'
import Player from '../player/player.model'
import Tournament from '../tournament/tournament.model'
import Score from '../score/score.model.js'
import mongoose from 'mongoose'
import _ from 'lodash'

function respondWithResult (res, statusCode) {
  statusCode = statusCode || 200
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

function patchUpdates (patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /* validate */ true)
    } catch (err) {
      return Promise.reject(err)
    }

    return entity.save()
  }
}

function removeEntity (res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end()
        })
    }
  }
}

function handleEntityNotFound (res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end()
      return null
    }
    return entity
  }
}

function handleError (res, statusCode) {
  statusCode = statusCode || 500
  return function (err) {
    res.status(statusCode).send(err)
  }
}

// Gets a list of Seriess
export function index (req, res) {
  return Series
    .find()
    .populate('game')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single Series from the DB
export function show (req, res) {
  return Series
    .findById(req.params.id)
    .populate('tournaments game')
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new Series in the DB
export function create (req, res) {
  return Series.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Upserts the given Series in the DB at the specified ID
export function upsert (req, res) {
  if (req.body._id) {
    delete req.body._id
  }
  return Series.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Updates an existing Series in the DB
export function patch (req, res) {
  if (req.body._id) {
    delete req.body._id
  }
  return Series.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Deletes a Series from the DB
export function destroy (req, res) {
  return Series.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}

// get player scores from a series and tournaments
export function getSeriesPlayer (req, res) {
  let promises = []

  promises.push(new Promise((resolve, reject) => {
    let query = Series
      .findById(req.params.series_id)
      .exec()

    query
      .then(series => resolve(series))
      .catch(err => reject(err))
  }))

  promises.push(new Promise((resolve, reject) => {
    let query = Player
      .findById(req.params.player_id)
      .exec()

    query
      .then(player => resolve(player))
      .catch(err => reject(err))
  }))

  promises.push(new Promise((resolve, reject) => {
    let query = Tournament
      .find({
        series: mongoose.Types.ObjectId(req.params.series_id)
      }, '_id')
      .exec()

    query
      .then(tournaments => {
        tournaments = _.map(tournaments, '_id')

        let sq = Score
          .aggregate([{
            $match: {
              _tournamentId: {
                $in: tournaments
              },
              _playerId: mongoose.Types.ObjectId(req.params.player_id)
            }
          }, {
            $lookup: {
              from: 'tournaments',
              localField: '_tournamentId',
              foreignField: '_id',
              as: 'tournament'
            }
          }, {
            $sort: {
              'tournament.date_time': -1
            }
          }])
          .exec()

        sq
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  }))

  Promise
    .all(promises)
    .then(respondWithResult(res))
    .catch(handleError(res))
}
