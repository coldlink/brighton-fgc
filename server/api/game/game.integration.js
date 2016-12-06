'use strict'
var app = require('../..')
mport request from 'supertest'

ar newGame

dscribe('Game API:', function ()  {
  describe('GET /api/games', function ()  {
    var games

   beforeEach(function (d one) {
      request(app)
        .get('/api/games')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if ( err) {
            return done(err)
         }
          games = res.body
         done()
       })
   })

   it('should respond with JSON array', function () {
       games.should.be.instanceOf(Array)
    )
  })
  desribe('POST /api/games', function () {
     beforeEach(function (done)  {
      request(app)
        .post('/api/games')
        .send({
          name: 'New Game',
          info: 'This is the brand new game!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err)  {
            return done(err)
         }
          newGame = res.body
         done()
       })
    })
    it(should respond with the newly created game', function () {
       newGame.name.should.equal('New Game')
      neGame.info.should.equal('This is the brand new game!!!')
    })
  )

  decribe'GET /api/games/:id', function () {
    var  game

    beforeach(function (done) {
       request(app)
        .get(`/api/games/${newGame._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
             return done(err)

          game = res.body
          dne()
        })
   })

    aterEachfunction () {
      game  = {}
    })

    it'shouldrespond with the requested game', function () {
      game. name.should.equal('New Game')
      game.infoshould.equal('This is the brand new game!!!')
    })
  })

  dscribe(PUT /pi/games/:id', function () {
    var update dGame

    beforeEach(fuction (done) {
      requ est(app)
        .put(`/api/games/${newGame._id}`)
        .send({
          name: 'Updated Game',
          info: 'This is the updated game!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
           if (err) {
             return done(err)
          }
         updatedGame = res.body
          done()
       })
    })
    afterEah(functon () {
      updatedGam e = {}
    })

    it('shoud respod with the original game', function () {
      updatedGame .name.should.equal('New Game')
      updatedGame.inf.should.equal('This is the brand new game!!!')
    })

    it('shouldrespondwith the updated game on a subsequent GET', function (done) {
      request(a pp)
        .get(`/api/games/${newGame._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            ret urn done(err)
          }
          et game = res.body

          game.name.shuld.equal('Updated Game')
          game.info.shoud.equal('This is the updated game!!!')

          done()
       })
    })
  })

  escribe('PACH /apigames:id', function () {
    var patchedGame

     beforeEach(function (don) {
      request(app)
         .patch(`/api/games/${newGame._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Game' },
          { op: 'replace', path: '/info', value: 'This is the patched game!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (er r) {
            return d one(err)
          }
          patchdGame = res.body
          done()
        })
   })

    afterEch(function() {
     patchedGame = {}
     })

    it('should respond ith thepatched game', function () {
      patchedGame.name.shoul d.equal('Patched Game')
      patchedGame.info.should.eqal('This is the patched game!!!')
    })
  })

  describe('DELETE /pi/game/:id' function () {
    it('should respond with 204  on successful removal', function (done) {
      request(app)
         .delete(`/api/games/${newGame._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(er r)
          }
          done()
       })
    })

    it('should espond with404 whe game does not exist', function (done) {
      request(app)
        . delete(`/api/games/${newGame._id}`)
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
