const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;
const data = require('../controllers/puzzle-strings').puzzlesAndSolutions;

let validUnsolved = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const invalidChars = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37Z';
const invalidLength = validUnsolved + '1';

suite('UnitTests', function() {

    suiteSetup(function() {
        solver = new Solver();
    });

    test('Logic handles a valid puzzle string of 81 characters', function(done) {
        const result = solver.validate(validUnsolved);
        assert.equal(result[0], true);
        done();
    });

    test('Logic handles a puzzle string with invalid characters', function(done) {
        const result = solver.validate(invalidChars);
        assert.equal(result[0], false);
        done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
        const result = solver.validate(invalidLength);
        assert.equal(result[0], false);
        done();
    });

    test('Logic handles a valid row placement', function(done) {
        assert.equal(solver.checkRowPlacement(validUnsolved, 0, 1, '3'), true);
        done();
    });

    test('Logic handles an invalid row placement', function(done) {
        assert.equal(solver.checkRowPlacement(validUnsolved, 0, 1, '1'), false);
        done();
    });

    test('Logic handles a valid column placement', function(done) {
        assert.equal(solver.checkColPlacement(validUnsolved, 0, 4, '6'), true);
        assert.equal(solver.checkColPlacement(validUnsolved, 4, 8, '5'), true);
        done();
    });

    test('Logic handles an invalid column placement', function(done) {
        assert.equal(solver.checkColPlacement(validUnsolved, 0, 4, '1'), false);
        done();
    });

    test('Logic handles a valid region placement', function(done) {
        assert.equal(solver.checkRegionPlacement(validUnsolved, 0, 1, '3'), true);
        assert.equal(solver.checkRegionPlacement(validUnsolved, 4, 3, '4'), true);
        done();
    });

    test('Logic handles an invalid region placement', function(done) {
        assert.equal(solver.checkRegionPlacement(validUnsolved, 0, 1, '6'), false);
        assert.equal(solver.checkRegionPlacement(validUnsolved, 4, 3, '2'), false);
        done();
    });

    test('Valid puzzle string pass the solver', function(done) {
        const ans = solver.solve(validUnsolved);
        assert.isNotArray(ans);
        assert.isString(ans);
        assert.equal(ans.length, 81);
        done();
    });

    test('Invalid puzzle string fail the solver', function(done) {
        const ansChars = solver.solve(invalidChars);
        const ansLength = solver.solve(invalidLength);
        assert.isArray(ansChars);
        assert.equal(ansChars[0], false);
        assert.equal(ansChars[1], "Invalid characters in puzzle");
        assert.isArray(ansLength);
        assert.equal(ansLength[0], false);
        assert.equal(ansLength[1], "Expected puzzle to be 81 characters long");
        done();
    })

    test('Solver returns the expected solution for an incomplete puzzle', function(done) {
        for (let i = 0; i < data.length; i++) {
            console.log(`Unsolved: ${data[i][0]}\nsolved: ${data[i][1]}`);
            assert.equal(solver.solve(data[i][0]), data[i][1]);
        }
        done();
    })
});
