'use strict';

var should = require('should');
var sinon = require('sinon');
var MessagesController = require('../lib/messages');
var gobytecore = require('@gobytecoin/gobytecore-lib');
var _ = require('lodash');

describe('Messages', function() {

  var privateKey = gobytecore.PrivateKey.fromWIF('cbHWxZTPDhKSVzf6gzME37k6arRs7UPrUYzW9hBKE7zpatpLi4gR');
  var address = 'nPrXjBx5x3fH8LJ8PsanE4PAdVmWBqMXTX';
  var badAddress = 'nPrXjBx5x3fH8LJ8PsanE4PAdVmWBqMXTY';
  var signature = 'IM5mNEOGRK+BIDmol90ACSE/KSAz2oqNT8xjPJGbXCcBd/ekWePv9lxd6cast0I6n+3y28PGG+0+sGn28eJ2aR8=';
  var message = 'iamgroot';

  it('will verify a message (true)', function(done) {

    var controller = new MessagesController({node: {}});

    var req = {
      body: {
        'address': address,
        'signature': signature,
        'message': message
      },
      query: {}
    };
    var res = {
      json: function(data) {
        data.result.should.equal(true);
        done();
      }
    };

    controller.verify(req, res);
  });

  it('will verify a message (false)', function(done) {

    var controller = new MessagesController({node: {}});

    var req = {
      body: {
        'address': address,
        'signature': signature,
        'message': 'wrong message'
      },
      query: {}
    };
    var res = {
      json: function(data) {
        data.result.should.equal(false);
        done();
      }
    };

    controller.verify(req, res);
  });

  it('handle an error from message verification', function(done) {
    var controller = new MessagesController({node: {}});
    var req = {
      body: {
        'address': badAddress,
        'signature': signature,
        'message': message
      },
      query: {}
    };
    var send = sinon.stub();
    var status = sinon.stub().returns({send: send});
    var res = {
      status: status,
    };
    controller.verify(req, res);
    status.args[0][0].should.equal(400);
    send.args[0][0].should.equal('Unexpected error: Checksum mismatch. Code:1');
    done();
  });

  it('handle error with missing parameters', function(done) {
    var controller = new MessagesController({node: {}});
    var req = {
      body: {},
      query: {}
    };
    var send = sinon.stub();
    var status = sinon.stub().returns({send: send});
    var res = {
      status: status
    };
    controller.verify(req, res);
    status.args[0][0].should.equal(400);
    send.args[0][0].should.match(/^Missing parameters/);
    done();
  });

});
