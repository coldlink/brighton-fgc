'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var characterCtrlStub = {
  index: 'characterCtrl.index',
  show: 'characterCtrl.show',
  create: 'characterCtrl.create',
  upsert: 'characterCtrl.upsert',
  patch: 'characterCtrl.patch',
  destroy: 'characterCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var characterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './character.controller': characterCtrlStub
});

describe('Character API Router:', function() {
  it('should return an express router instance', function() {
    characterIndex.should.equal(routerStub);
  });

  describe('GET /api/characters', function() {
    it('should route to character.controller.index', function() {
      routerStub.get
        .withArgs('/', 'characterCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/characters/:id', function() {
    it('should route to character.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'characterCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/characters', function() {
    it('should route to character.controller.create', function() {
      routerStub.post
        .withArgs('/', 'characterCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/characters/:id', function() {
    it('should route to character.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'characterCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/characters/:id', function() {
    it('should route to character.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'characterCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/characters/:id', function() {
    it('should route to character.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'characterCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
