'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      let puzzle = req.body.puzzle;
      if ((!coordinate) || (!value) || (!puzzle)) {
        return res.status(400).json({
          error: "Required field(s) missing"
        });
      }

      let temp = solver.coordinateConverter(coordinate);
      let row = temp[0];
      let col = temp[1];

      if (solver.isSafe(puzzle, row, col, value) === true) {
        return res.status(200).json({
          valid: true
        });
      } else {
        
        let reason = [];
        if (!solver.checkRowPlacement(puzzle, row, col, value)) {
          reason.push("row");
        }
        if (!solver.checkColPlacement(puzzle, row, col, value)) {
          reason.push("column");
        }
        if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
          reason.push("region");
        }

        return res.status(200).json({
          valid: false,
          conflict: reason
        });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.status(400).json({error: "Required field missing"});
      }

      let result = solver.solve(puzzle);
      if (Array.isArray(result)) {
        return res.status(400).json({
          error: result[1]
        });
      } else if (result === false) {
        return res.status(400).json({
          error: "Puzzle cannot be solved"});
      } else {
        return res.status(200).json({
          solution: result
        });
      }
    });
};
