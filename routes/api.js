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

      // Input value check
      let valNum = parseInt(value);
      if (!Number.isInteger(valNum) || valNum < 1 || valNum > 9) {
        return res.status(200).json({
          error: "Invalid value"
        })
      }

      // Check coordinate
      let temp = solver.coordinateConverter(coordinate);
      if (typeof temp === "string") {
        // invalid coordinate
        return res.status(200).json({
          error: "Invalid coordinate"
        })
      }
      let row = temp[0];
      let col = temp[1];

      // Sudoku board validity check
      let valid = solver.validate(puzzle);
      if (valid[0] === false) {
        return res.status(200).json({
          error: valid[1]
        });
      }

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
