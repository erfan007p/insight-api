'use strict';

var sinon = require('sinon');
var should = require('should');
var SporkController = require('../lib/sporks');

describe('Spork', function () {
	describe('/spork', function () {
		var SporkList = {
			"sporks": {
				"SPORK_2_INSTANTSEND_ENABLED": 1622899900,
				"SPORK_3_INSTANTSEND_BLOCK_FILTERING": 1622899999,
				"SPORK_9_SUPERBLOCKS_ENABLED": 1622900117,
				"SPORK_17_QUORUM_DKG_ENABLED": 1622900070,
				"SPORK_19_CHAINLOCKS_ENABLED": 1622900100,
				"SPORK_21_QUORUM_ALL_CONNECTED": 1622900128,
				"SPORK_22_PS_MORE_PARTICIPANTS": 1622900128
			}
		};
		var node = {
			services: {
        gobyted: {
					getSpork: sinon.stub().callsArgWith(0, null, SporkList)
				}
			}
		};

		var sporks = new SporkController(node);

		it('get spork', function (done) {
			var req = {};
			var res = {
				jsonp: function (data) {
					should.exist(data.sporks);
					should.exist(data.sporks.SPORK_2_INSTANTSEND_ENABLED);
					should.exist(data.sporks.SPORK_3_INSTANTSEND_BLOCK_FILTERING);
					should.exist(data.sporks.SPORK_9_SUPERBLOCKS_ENABLED);
					should.exist(data.sporks.SPORK_17_QUORUM_DKG_ENABLED);
					should.exist(data.sporks.SPORK_19_CHAINLOCKS_ENABLED);
					should.exist(data.sporks.SPORK_21_QUORUM_ALL_CONNECTED);
					should.exist(data.sporks.SPORK_22_PS_MORE_PARTICIPANTS);
					done();
				}
			};

			sporks.list(req, res);
		});
	});
});
