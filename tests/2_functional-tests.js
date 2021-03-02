const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validUnsolved = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidChars = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37Z';
const invalidLength = validUnsolved + '1';
let validSolved = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const unsolveable = '13576298494638125772845961369451783281293674535782419647329856958167342.269145379';

suite('Functional Tests', function () {

    suiteTeardown(function(done) {
        chai.request.agent(server).close();
        done();
    });

    test('/api/solve, solves valid puzzle string', function() {
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle: validUnsolved
            })
            .end(function(err, res) {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, validSolved);
            });
    });

    test('/api/solve, missing puzzle string', function() {
        chai.request(server)
            .post('/api/solve')
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Required field missing");
            });
    });

    test('/api/solve, invalid characters in sudoku board', function() {
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle: invalidChars
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Invalid characters in puzzle");
            });
    });

    test('/api/solve, incorrect length of sudoku board', function() {
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle: invalidLength
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            });
    });

    test('/api/solve, cannot be solved', function() {
        chai.request(server)
            .post('/api/solve')
            .type('form')
            .send({
                puzzle: unsolveable
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
            });
    });

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
                coordinate: "A2",
                value: "9"
            })
            .end(function(err, res) {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict[0], "column");
            });
    });

    test('POST to /api/check reports multiple placement conflict', function() {
        chai.request(server)
            .post('/api/check')
            .type("form")
            .send({
                puzzle: validUnsolved,
                coordinate: "A2",
                value: "5"
            })
            .end(function(err, res) {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.isTrue(res.body.conflict.length > 1);
                assert.equal(res.body.conflict[0], "row");
                assert.equal(res.body.conflict[1], "region");
            })
    });

    test('POST to /api/check reports all placement conflict', function() {
        chai.request(server)
            .post('/api/check')
            .type("form")
            .send({
                puzzle: validUnsolved,
                coordinate: "E4",
                value: "3"
            })
            .end(function(err, res) {
                assert.equal(err, null);
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isFalse(res.body.valid);
                assert.isArray(res.body.conflict);
                assert.isTrue(res.body.conflict.length === 3);
                assert.isTrue(res.body.conflict.includes("row"));
                assert.isTrue(res.body.conflict.includes("column"));
                assert.isTrue(res.body.conflict.includes("region"));
            })
    });

    test('POST to /api/check detects missing request fields', function() {
        chai.request(server)
            .post('/api/check')
            .type("form")
            .send({
                puzzle: validUnsolved
            })
            .end(function(err, res) {
                assert.equal(res.status, 400);
                assert.isObject(res.body);
                assert.equal(res.body.error, "Required field(s) missing");
            });
    });

    test('/api/check, invalid characters in sudoku board', function() {
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle: invalidChars,
                coordinate: 'A1',
                value: '7'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Invalid characters in puzzle");
            });
    });

    test('/api/check, incorrect length', function() {
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle: invalidLength,
                coordinate: 'A1',
                value: '7'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
            });
    });

    test('/api/check, invalid coordinate', function() {
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle: validUnsolved,
                coordinate: 'J1',
                value: '1'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Invalid coordinate");
            });
    });

    test('/api/check, invalid value', function() {
        chai.request(server)
            .post('/api/check')
            .type('form')
            .send({
                puzzle: validUnsolved,
                coordinate: 'A1',
                value: '42'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body)
                assert.isTrue(Object.keys(res.body).includes("error"));
                assert.equal(res.body.error, "Invalid value");
            });
    });
});

