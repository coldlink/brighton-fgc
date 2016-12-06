'use strict'

var app = require('../..')
import request from 'supertest'

var newAttendance

describe('Attendance API:', function () {
  describe('GET /api/attendance', function () {
    var attendances

    beforeEach(function (done) {
      request(app)
        .get('/api/attendance')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          attendances = res.body
          done()
        })
    })

    it('should respond with JSON array', function () {
      attendances.should.be.instanceOf(Array)
    })
  })

  describe('POST /api/attendance', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/attendance')
        .send({
          name: 'New Attendance',
          info: 'This is the brand new attendance!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          newAttendance = res.body
          done()
        })
    })

    it('should respond with the newly created attendance', function () {
      newAttendance.name.should.equal('New Attendance')
      newAttendance.info.should.equal('This is the brand new attendance!!!')
    })
  })

  describe('GET /api/attendance/:id', function () {
    var attendance

    beforeEach(function (done) {
      request(app)
        .get(`/api/attendance/${newAttendance._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          attendance = res.body
          done()
        })
    })

    afterEach(function () {
      attendance = {}
    })

    it('should respond with the requested attendance', function () {
      attendance.name.should.equal('New Attendance')
      attendance.info.should.equal('This is the brand new attendance!!!')
    })
  })

  describe('PUT /api/attendance/:id', function () {
    var updatedAttendance

    beforeEach(function (done) {
      request(app)
        .put(`/api/attendance/${newAttendance._id}`)
        .send({
          name: 'Updated Attendance',
          info: 'This is the updated attendance!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          updatedAttendance = res.body
          done()
        })
    })

    afterEach(function () {
      updatedAttendance = {}
    })

    it('should respond with the original attendance', function () {
      updatedAttendance.name.should.equal('New Attendance')
      updatedAttendance.info.should.equal('This is the brand new attendance!!!')
    })

    it('should respond with the updated attendance on a subsequent GET', function (done) {
      request(app)
        .get(`/api/attendance/${newAttendance._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          let attendance = res.body

          attendance.name.should.equal('Updated Attendance')
          attendance.info.should.equal('This is the updated attendance!!!')

          done()
        })
    })
  })

  describe('PATCH /api/attendance/:id', function () {
    var patchedAttendance

    beforeEach(function (done) {
      request(app)
        .patch(`/api/attendance/${newAttendance._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Attendance' },
          { op: 'replace', path: '/info', value: 'This is the patched attendance!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          patchedAttendance = res.body
          done()
        })
    })

    afterEach(function () {
      patchedAttendance = {}
    })

    it('should respond with the patched attendance', function () {
      patchedAttendance.name.should.equal('Patched Attendance')
      patchedAttendance.info.should.equal('This is the patched attendance!!!')
    })
  })

  describe('DELETE /api/attendance/:id', function () {
    it('should respond with 204 on successful removal', function (done) {
      request(app)
        .delete(`/api/attendance/${newAttendance._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('should respond with 404 when attendance does not exist', function (done) {
      request(app)
        .delete(`/api/attendance/${newAttendance._id}`)
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
