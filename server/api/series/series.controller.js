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
  return Series.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

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
