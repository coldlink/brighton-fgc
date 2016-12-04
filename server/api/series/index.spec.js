'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var seriesCtrlStub = {
  index: 'seriesCtrl.index',
  show: 'seriesCtrl.show',
  create: 'seriesCtrl.create',
  upsert: 'seriesCtrl.upsert',
  patch: 'seriesCtrl.patch',
  destroy: 'seriesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var seriesIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './series.controller': seriesCtrlStub
});

describe('Series API Router:', function() {
  it('should return an express router instance', function() {
    seriesIndex.should.equal(routerStub);
  });

  describe('GET /api/series', function() {
    it('should route to series.controller.index', function() {
      routerStub.get
        .withArgs('/', 'seriesCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/series/:id', function() {
    it('should route to series.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'seriesCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/series', function() {
    it('should route to series.controller.create', function() {
      routerStub.post
        .withArgs('/', 'seriesCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/series/:id', function() {
    it('should route to series.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'seriesCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/series/:id', function() {
    it('should route to series.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'seriesCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/series/:id', function() {
    it('should route to series.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'seriesCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
