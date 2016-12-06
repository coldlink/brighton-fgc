'use strict'

var app = require('../..')
import request from 'supertest'

var newTournament

describe('Tournament API:', function () {
  describe('GET /api/tournaments', function () {
    var tournaments

    beforeEach(function (done) {
      request(app)
        .get('/api/tournaments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          tournaments = res.body
          done()
        })
    })

    it('should respond with JSON array', function () {
      tournaments.should.be.instanceOf(Array)
    })
  })

  describe('POST /api/tournaments', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/tournaments')
        .send({
          name: 'New Tournament',
          info: 'This is the brand new tournament!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          newTournament = res.body
          done()
        })
    })

    it('should respond with the newly created tournament', function () {
      newTournament.name.should.equal('New Tournament')
      newTournament.info.should.equal('This is the brand new tournament!!!')
    })
  })

  describe('GET /api/tournaments/:id', function () {
    var tournament

    beforeEach(function (done) {
      request(app)
        .get(`/api/tournaments/${newTournament._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          tournament = res.body
          done()
        })
    })

    afterEach(function () {
      tournament = {}
    })

    it('should respond with the requested tournament', function () {
      tournament.name.should.equal('New Tournament')
      tournament.info.should.equal('This is the brand new tournament!!!')
    })
  })

  describe('PUT /api/tournaments/:id', function () {
    var updatedTournament

    beforeEach(function (done) {
      request(app)
        .put(`/api/tournaments/${newTournament._id}`)
        .send({
          name: 'Updated Tournament',
          info: 'This is the updated tournament!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          updatedTournament = res.body
          done()
        })
    })

    afterEach(function () {
      updatedTournament = {}
    })

    it('should respond with the original tournament', function () {
      updatedTournament.name.should.equal('New Tournament')
      updatedTournament.info.should.equal('This is the brand new tournament!!!')
    })

    it('should respond with the updated tournament on a subsequent GET', function (done) {
      request(app)
        .get(`/api/tournaments/${newTournament._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          let tournament = res.body

          tournament.name.should.equal('Updated Tournament')
          tournament.info.should.equal('This is the updated tournament!!!')

          done()
        })
    })
  })

  describe('PATCH /api/tournaments/:id', function () {
    var patchedTournament

    beforeEach(function (done) {
      request(app)
        .patch(`/api/tournaments/${newTournament._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Tournament' },
          { op: 'replace', path: '/info', value: 'This is the patched tournament!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          patchedTournament = res.body
          done()
        })
    })

    afterEach(function () {
      patchedTournament = {}
    })

    it('should respond with the patched tournament', function () {
      patchedTournament.name.should.equal('Patched Tournament')
      patchedTournament.info.should.equal('This is the patched tournament!!!')
    })
  })

  describe('DELETE /api/tournaments/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/tournaments/${newTournament._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('should respond with 404 when tournament does not exist', function (done) {
      request(app)
        .delete(`/api/tournaments/${newTournament._id}`)
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
