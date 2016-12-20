/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/players              ->  index
 * POST    /api/players              ->  create
 * GET     /api/players/:id          ->  show
 * PUT     /api/players/:id          ->  upsert
 * PATCH   /api/players/:id          ->  patch
 * DELETE  /api/players/:id          ->  destroy
 */

'use strict'

import jsonpatch from 'fast-json-patch'
import Player from './player.model'
import Match from '../match/match.model'
import Tournament from '../tournament/tournament.model'
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
    console.log(err)
    res.status(statusCode).send(err)
  }
}

// Gets a list of Players
export function index (req, res) {
  return Player.find({}, '-name').exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

export function indexMin (req, res) {
  return Player.find({}, '_id handle').exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Gets a single Player from the DB
export function show (req, res) {
  return Player.findById(req.params.id, '-name').exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Creates a new Player in the DB
export function create (req, res) {
  return Player.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res))
}

// Upserts the given Player in the DB at the specified ID
export function upsert (req, res) {
  if (req.body._id) {
    delete req.body._id
  }
  return Player.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Updates an existing Player in the DB
export function patch (req, res) {
  if (req.body._id) {
    delete req.body._id
  }
  return Player.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res))
}

// Deletes a Player from the DB
export function destroy (req, res) {
  return Player.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res))
}

export function statistics (req, res) {
  let matchAgg = Match
    .aggregate([{
      $match: {
        $or: [{
          _player1Id: mongoose.Types.ObjectId(req.params.id)
        }, {
          _player2Id: mongoose.Types.ObjectId(req.params.id)
        }]
      }
    }, {
      $project: {
        _id: 1,
        _tournamentId: 1,
        _player1Id: 1,
        _player2Id: 1,
        _winnerId: 1,
        _loserId: 1,
        score: 1,
        round: 1,
        completed_at: '$challonge_match_obj.completed_at'
      }
    }])
    .exec()

  matchAgg
    .then(datas => getStats(req, res, datas))
    .catch(handleError(res))
}

export function statisticsExtra (req, res) {
  // req.params.type - series/game
  if (!req.params.type || (req.params.type !== 'series' && req.params.type !== 'game')) {
    return res.status(422).send('Validation Error')
  }

  if (req.params.type && !req.params.typeId) return res.status(422).send('Validation Error')

  // get tournaments by name or series
  let tournamentQuery = Tournament
    .find({
      [req.params.type]: mongoose.Types.ObjectId(req.params.typeId)
    }, '_id')
    .exec()

  tournamentQuery
    .then(tournaments => {
      tournaments = _.map(tournaments, '_id')
      let matchAgg = Match
        .aggregate([{
          $match: {
            _tournamentId: {
              $in: tournaments
            },
            $or: [{
              _player1Id: mongoose.Types.ObjectId(req.params.id)
            }, {
              _player2Id: mongoose.Types.ObjectId(req.params.id)
            }]
          }
        }, {
          $project: {
            _id: 1,
            _tournamentId: 1,
            _player1Id: 1,
            _player2Id: 1,
            _winnerId: 1,
            _loserId: 1,
            score: 1,
            round: 1,
            completed_at: '$challonge_match_obj.completed_at'
          }
        }])
        .exec()

      matchAgg
        .then(datas => getStats(req, res, datas))
        .catch(handleError(res))
    })
    .catch(handleError(res))
}

const getStats = (req, res, datas) => {
  if (!datas || !datas.length) return res.status(404).send('Not Found')
  // sort by date
  datas = _.reverse(_.sortBy(datas, o => new Date(o.completed_at)))

  let proms = []

  // calculate total matches
  proms.push(new Promise((resolve, reject) => {
    resolve(datas.length)
  }))

  // calculate matches won
  proms.push(new Promise((resolve, reject) => {
    resolve(_.groupBy(datas, '_winnerId')[req.params.id].length)
  }))

  // calculate matches lost
  proms.push(new Promise((resolve, reject) => {
    resolve(_.groupBy(datas, '_loserId')[req.params.id].length)
  }))

  // calculate games
  proms.push(new Promise((resolve, reject) => {
    let games = {
      played: 0,
      win: 0
    }
    _.each(datas, match => {
      let player
      if (match._player1Id.toString() === req.params.id) {
        player = 1
      } else {
        player = 2
      }

      _.each(match.score, score => {
        games.played += Number(score.p1) + Number(score.p2)
        if (player === 1) games.win += Number(score.p1)
        else games.win += Number(score.p2)
      })
    })
    games.loss = games.played - games.win
    games.winRate = games.win / games.played * 100
    resolve(games)
  }))

  // get last 3 matches
  proms.push(new Promise((resolve, reject) => {
    let oppProms = []

    _.each(_.slice(datas, 0, 3), match => {
      oppProms.push(new Promise((resolve, reject) => {
        let opp
        if (match._player1Id.toString() === req.params.id) opp = 2
        else opp = 1

        let oppQuery = Player
          .findById(match[`_player${opp}Id`], '_id handle')
          .exec()

        oppQuery
          .then(opponent => {
            let isWinner
            if (match._winnerId.toString() === req.params.id) isWinner = true
            else isWinner = false

            let playerScr = []
            let opponentScr = []

            _.each(match.score, score => {
              if (opp === 2) {
                playerScr.push(Number(score.p1))
                opponentScr.push(Number(score.p2))
              } else {
                playerScr.push(Number(score.p2))
                opponentScr.push(Number(score.p1))
              }
            })

            resolve({
              isWinner,
              playerScr,
              opponentScr,
              opponent,
              completed_at: new Date(match.completed_at).getTime()
            })
          })
          .catch(err => reject(err))
      }))
    })

    Promise
      .all(oppProms)
      .then(values => resolve(values))
      .catch(err => reject(err))
  }))

  // get player info
  proms.push(new Promise((resolve, reject) => {
    let query = Player
      .findById(req.params.id, '-name')
      .exec()

    query
      .then(player => {
        if (!player) return reject('Not Found')
        resolve(player)
      })
      .catch(err => reject(err))
  }))

  // meta information
  proms.push(new Promise((resolve, reject) => {
    let meta = {
      playerId: req.params.id
    }

    if (req.params.type && req.params.typeId) {
      meta.type = req.params.type
      meta.typeId = req.params.typeId
    }

    resolve(meta)
  }))

  Promise
    .all(proms)
    .then(values => res.status(200).json({
      matches: {
        played: values[0],
        win: values[1],
        loss: values[2],
        winRate: values[1] / values[0] * 100
      },
      games: values[3],
      latestMatches: values[4],
      player: values[values.length - 2],
      meta: values[values.length - 1]
    }))
    .catch(handleError(res))
}

export function headToHead (req, res) {
  if (!req.params.playerId || !req.params.opponentId) return res.status(422).send('Validation Error')

  let matchQuery = Match
    .aggregate([{
      $match: {
        $or: [{
          _player1Id: mongoose.Types.ObjectId(req.params.playerId),
          _player2Id: mongoose.Types.ObjectId(req.params.opponentId)
        }, {
          _player1Id: mongoose.Types.ObjectId(req.params.opponentId),
          _player2Id: mongoose.Types.ObjectId(req.params.playerId)
        }]
      }
    }, {
      $project: {
        _id: 1,
        _tournamentId: 1,
        _player1Id: 1,
        _player2Id: 1,
        _winnerId: 1,
        _loserId: 1,
        score: 1,
        round: 1,
        completed_at: '$challonge_match_obj.completed_at'
      }
    }])

  matchQuery
    .then(datas => getHeadToHead(req, res, datas))
    .catch(handleError(res))
}

export function headToHeadExtra (req, res) {
  if (!req.params.playerId || !req.params.opponentId) return res.status(422).send('Validation Error')

  if (!req.params.type || (req.params.type !== 'series' && req.params.type !== 'game')) {
    return res.status(422).send('Validation Error')
  }

  if (req.params.type && !req.params.typeId) return res.status(422).send('Validation Error')

  // get tournaments by name or series
  let tournamentQuery = Tournament
    .find({
      [req.params.type]: mongoose.Types.ObjectId(req.params.typeId)
    }, '_id')
    .exec()

  tournamentQuery
    .then(tournaments => {
      tournaments = _.map(tournaments, '_id')

      let matchQuery = Match
        .aggregate([{
          $match: {
            _tournamentId: {
              $in: tournaments
            },
            $or: [{
              _player1Id: mongoose.Types.ObjectId(req.params.playerId),
              _player2Id: mongoose.Types.ObjectId(req.params.opponentId)
            }, {
              _player1Id: mongoose.Types.ObjectId(req.params.opponentId),
              _player2Id: mongoose.Types.ObjectId(req.params.playerId)
            }]
          }
        }, {
          $project: {
            _id: 1,
            _tournamentId: 1,
            _player1Id: 1,
            _player2Id: 1,
            _winnerId: 1,
            _loserId: 1,
            score: 1,
            round: 1,
            completed_at: '$challonge_match_obj.completed_at'
          }
        }])

      matchQuery
        .then(datas => getHeadToHead(req, res, datas))
        .catch(handleError(res))
    })
    .catch(handleError(res))
}

const getHeadToHead = (req, res, datas) => {
  if (!datas || !datas.length) return res.status(404).send('Not Found')

  // sort by date
  datas = _.reverse(_.sortBy(datas, o => new Date(o.completed_at)))

  let proms = []

  // calculate total matches
  proms.push(new Promise((resolve, reject) => {
    resolve(datas.length)
  }))

  // calculate player matches won
  proms.push(new Promise((resolve, reject) => {
    let matches = _.groupBy(datas, '_winnerId')[req.params.playerId]
    resolve(matches ? matches.length : 0)
  }))

  // calculate opponent matches won
  proms.push(new Promise((resolve, reject) => {
    let matches = _.groupBy(datas, '_winnerId')[req.params.opponentId]
    resolve(matches ? matches.length : 0)
  }))

  // calculate games
  proms.push(new Promise((resolve, reject) => {
    let games = {
      played: 0,
      playerWin: 0
    }
    _.each(datas, match => {
      let player
      if (match._player1Id.toString() === req.params.id) {
        player = 1
      } else {
        player = 2
      }

      _.each(match.score, score => {
        games.played += Number(score.p1) + Number(score.p2)
        if (player === 1) games.playerWin += Number(score.p1)
        else games.playerWin += Number(score.p2)
      })
    })
    games.opponentWin = games.played - games.playerWin
    games.playerWinRate = games.playerWin / games.played * 100
    games.opponentWinRate = games.opponentWin / games.played * 100
    resolve(games)
  }))

  // last 3 matches
  proms.push(new Promise((resolve, reject) => {
    let oppProms = []

    _.each(_.slice(datas, 0, 3), match => {
      oppProms.push(new Promise((resolve, reject) => {
        let opp
        if (match._player1Id.toString() === req.params.playerId) opp = 2
        else opp = 1

        let isWinner
        if (match._winnerId.toString() === req.params.playerId) isWinner = true
        else isWinner = false

        let playerScr = []
        let opponentScr = []

        _.each(match.score, score => {
          if (opp === 2) {
            playerScr.push(Number(score.p1))
            opponentScr.push(Number(score.p2))
          } else {
            playerScr.push(Number(score.p2))
            opponentScr.push(Number(score.p1))
          }
        })

        resolve({
          isWinner,
          playerScr,
          opponentScr,
          completed_at: new Date(match.completed_at).getTime()
        })
      }))
    })

    Promise
      .all(oppProms)
      .then(values => resolve(values))
      .catch(err => reject(err))
  }))

  // get player info
  proms.push(new Promise((resolve, reject) => {
    let query = Player
      .findById(req.params.playerId, '-name')
      .exec()

    query
      .then(player => {
        if (!player) return reject('Not Found')
        resolve(player)
      })
      .catch(err => reject(err))
  }))

  // get opponent info
  proms.push(new Promise((resolve, reject) => {
    let query = Player
      .findById(req.params.opponentId, '-name')
      .exec()

    query
      .then(player => {
        if (!player) return reject('Not Found')
        resolve(player)
      })
      .catch(err => reject(err))
  }))

  // meta information
  proms.push(new Promise((resolve, reject) => {
    let meta = {
      playerId: req.params.playerId,
      opponentId: req.params.opponentId
    }

    if (req.params.type && req.params.typeId) {
      meta.type = req.params.type
      meta.typeId = req.params.typeId
    }

    resolve(meta)
  }))

  Promise
    .all(proms)
    .then(values => res.status(200).json({
      matches: {
        played: values[0],
        playerWin: values[1],
        opponentWin: values[2],
        playerWinRate: values[1] / values[0] * 100,
        opponentWinRate: values[2] / values[0] * 100
      },
      games: values[3],
      latestMatches: values[4],
      player: values[values.length - 3],
      opponent: values[values.length - 2],
      meta: values[values.length - 1]
    }))
    .catch(handleError(res))
}
