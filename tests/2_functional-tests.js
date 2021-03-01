const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validUnsolved = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidChars = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37Z';
const invalidLength = validUnsolved + '1';

suite('Functional Tests', function () {
    test('POST to /api/check returns 200', function() {
        chai.request(server)
        .post('/api/check')
        .type('form')
        .send({
            puzzle: validUnsolved,
            coordinate: "A1",
            value: "7"
        })
        .end(function(err, res) {
            assert.equal(res.status, 200);
        });
    });

    test('POST to /api/check reports single placement conflict', function() {
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle: validUnsolved,
                coordinate: 'A1',
                value: "1"
            })
            .end(function(err, res) {
                assert.equal(res.status, 400);
                assert.isArray(res.body);
                assert.isFalse(res.body[0]);
            });
    })
});

