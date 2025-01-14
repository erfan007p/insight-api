'use strict';

var should = require('should');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var CurrencyController = require('../lib/currency');

describe('Currency', function() {

  var gobyteCentralData = {
    bitcoin:{
      usd:66002,
      btc:1.0
    },
    gobyte:{
      usd:0.051459,
      btc:7.79263e-07
    }
  };

  it('will make live request to gobyte central', function(done) {
    var currency = new CurrencyController({});
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.gbx_usd);
        (typeof response.data.gbx_usd).should.equal('number');
        done();
      }
    };
    currency.index(req, res);
  });

  it('will retrieve a fresh value', function(done) {
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: sinon.stub().callsArgWith(1, null, {statusCode: 200}, JSON.stringify(gobyteCentralData))
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      gbx_usd: 9.4858840414,
      btc_usd: 682.93,
      btc_gbx: 0.01388998
    };
    currency.timestamp = Date.now() - 61000 * CurrencyController.DEFAULT_CURRENCY_DELAY;
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.gbx_usd);
        response.data.gbx_usd.should.equal(0.051459);
        done();
      }
    };
    currency.index(req, res);
  });

  it('will log an error from request', function(done) {
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: sinon.stub().callsArgWith(1, new Error('test'))
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      gbx_usd: 9.4858840414,
      btc_usd: 682.93,
      btc_gbx: 0.01388998
    };
    currency.timestamp = Date.now() - 65000 * CurrencyController.DEFAULT_CURRENCY_DELAY;
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data);
        response.data.gbx_usd.should.equal(9.4858840414);
        node.log.error.callCount.should.equal(1);
        done();
      }
    };
    currency.index(req, res);
  });

  it('will retrieve a cached value', function(done) {
    var request = sinon.stub();
    var TestCurrencyController = proxyquire('../lib/currency', {
      request: request
    });
    var node = {
      log: {
        error: sinon.stub()
      }
    };
    var currency = new TestCurrencyController({node: node});
    currency.exchange_rates = {
      gbx_usd: 9.4858840414,
      btc_usd: 682.93,
      btc_gbx: 0.01388998
    };
    currency.timestamp = Date.now();
    var req = {};
    var res = {
      jsonp: function(response) {
        response.status.should.equal(200);
        should.exist(response.data.gbx_usd);
        response.data.gbx_usd.should.equal(9.4858840414);
        request.callCount.should.equal(0);
        done();
      }
    };
    currency.index(req, res);
  });

});
