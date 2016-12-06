'use strict'

var app = require('../..')
import request from 'supertest'

var newPlayer

describe('Player API:', function () {
  describe('GET /api/players', function () {
    var players

    beforeEach(function (done) {
      request(app)
        .get('/api/players')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          players = res.body
          done()
        })
    })

    it('should respond with JSON array', function () {
      players.should.be.instanceOf(Array)
    })
  })

  describe('POST /api/players', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/players')
        .send({
          name: 'New Player',
          info: 'This is the brand new player!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          newPlayer = res.body
          done()
        })
    })

    it('should respond with the newly created player', function () {
      newPlayer.name.should.equal('New Player')
      newPlayer.info.should.equal('This is the brand new player!!!')
    })
  })

  describe('GET /api/players/:id', function () {
    var player

    beforeEach(function (done) {
      request(app)
        .get(`/api/players/${newPlayer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          player = res.body
          done()
        })
    })

    afterEach(function () {
      player = {}
    })

    it('should respond with the requested player', function () {
      player.name.should.equal('New Player')
      player.info.should.equal('This is the brand new player!!!')
    })
  })

  describe('PUT /api/players/:id', function () {
    var updatedPlayer

    beforeEach(function (done) {
      request(app)
        .put(`/api/players/${newPlayer._id}`)
        .send({
          name: 'Updated Player',
          info: 'This is the updated player!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          updatedPlayer = res.body
          done()
        })
    })

    afterEach(function () {
      updatedPlayer = {}
    })

    it('should respond with the original player', function () {
      updatedPlayer.name.should.equal('New Player')
      updatedPlayer.info.should.equal('This is the brand new player!!!')
    })

    it('should respond with the updated player on a subsequent GET', function (done) {
      request(app)
        .get(`/api/players/${newPlayer._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          let player = res.body

          player.name.should.equal('Updated Player')
          player.info.should.equal('This is the updated player!!!')

          done()
        })
    })
  })

  describe('PATCH /api/players/:id', function () {
    var patchedPlayer

    beforeEach(function (done) {
      request(app)
        .patch(`/api/players/${newPlayer._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Player' },
          { op: 'replace', path: '/info', value: 'This is the patched player!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          patchedPlayer = res.body
          done()
        })
    })

    afterEach(function () {
      patchedPlayer = {}
    })

    it('should respond with the patched player', function () {
      patchedPlayer.name.should.equal('Patched Player')
      patchedPlayer.info.should.equal('This is the patched player!!!')
    })
  })

  describe('DELETE /api/players/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/players/${newPlayer._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('should respond with 404 when player does not exist', function (done) {
      request(app)
        .delete(`/api/players/${newPlayer._id}`)
        .expect(404)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })
  })
})
