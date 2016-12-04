'use strict';

var app = require('../..');
import request from 'supertest';

var newSeries;

describe('Series API:', function() {
  describe('GET /api/series', function() {
    var seriess;

    beforeEach(function(done) {
      request(app)
        .get('/api/series')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          seriess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      seriess.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/series', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/series')
        .send({
          name: 'New Series',
          info: 'This is the brand new series!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSeries = res.body;
          done();
        });
    });

    it('should respond with the newly created series', function() {
      newSeries.name.should.equal('New Series');
      newSeries.info.should.equal('This is the brand new series!!!');
    });
  });

  describe('GET /api/series/:id', function() {
    var series;

    beforeEach(function(done) {
      request(app)
        .get(`/api/series/${newSeries._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          series = res.body;
          done();
        });
    });

    afterEach(function() {
      series = {};
    });

    it('should respond with the requested series', function() {
      series.name.should.equal('New Series');
      series.info.should.equal('This is the brand new series!!!');
    });
  });

  describe('PUT /api/series/:id', function() {
    var updatedSeries;

    beforeEach(function(done) {
      request(app)
        .put(`/api/series/${newSeries._id}`)
        .send({
          name: 'Updated Series',
          info: 'This is the updated series!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSeries = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSeries = {};
    });

    it('should respond with the original series', function() {
      updatedSeries.name.should.equal('New Series');
      updatedSeries.info.should.equal('This is the brand new series!!!');
    });

    it('should respond with the updated series on a subsequent GET', function(done) {
      request(app)
        .get(`/api/series/${newSeries._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let series = res.body;

          series.name.should.equal('Updated Series');
          series.info.should.equal('This is the updated series!!!');

          done();
        });
    });
  });

  describe('PATCH /api/series/:id', function() {
    var patchedSeries;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/series/${newSeries._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Series' },
          { op: 'replace', path: '/info', value: 'This is the patched series!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSeries = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSeries = {};
    });

    it('should respond with the patched series', function() {
      patchedSeries.name.should.equal('Patched Series');
      patchedSeries.info.should.equal('This is the patched series!!!');
    });
  });

  describe('DELETE /api/series/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/series/${newSeries._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when series does not exist', function(done) {
      request(app)
        .delete(`/api/series/${newSeries._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
