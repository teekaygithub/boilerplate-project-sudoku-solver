const e = require("express");

class SudokuSolver {

  validate(puzzleString) {
    const valreg = /[^0-9|^\.]/
    return ((puzzleString.length === 81) && !valreg.test(puzzleString));
  }

  // true = ok to place value, false = not ok
  checkRowPlacement(puzzleString, row, column, value) {
    const start = row*9;
    const end = start + 9;
    let sub = puzzleString.substring(start, end);
    //console.log(`Row place: substring ${sub}`); //debug
    return !sub.includes(value);
  }

  //true = ok to place value, false = not ok
  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (puzzleString.charAt(r*9 + column) === value) {
        return false;
      }
    }
    return true;
  }

  // Checks the surrounding 3x3 grid to see if the input value already exists or not
  // true = ok to place value, false = not ok
  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = row - row % 3;
    const regionCol = column - column % 3;

    for (let i = 0; i < 3; i++) {
      let start = (regionRow+i)*9 + regionCol;
      let end = start + 3;
      let sub = puzzleString.substring(start, end);
      if (sub.includes(value)) {return false;}
    }
    return true;
  }

  // Comprehensive check of whether a value is ok to insert or not in a sudoku table
  isSafe(puzzleString, row, col ,value) {
    return this.checkRowPlacement(puzzleString, row, col, value) &&
          this.checkColPlacement(puzzleString, row, col, value) &&
          this.checkRegionPlacement(puzzleString, row, col, value);
  }

  // Primary solver
  solve(puzzleString) {
    return this.helper(puzzleString);
  }

  // Recursive function to try all possible combination of value until all table indices can be filled with a number
  helper(puzzleString) {

    if(!this.validate(puzzleString)) {return false;}

    var isDone = true;
    var row = -1;
    var col = -1;
    for (var i = 0; i < puzzleString.length; i++) {
      if(puzzleString.charAt(i) === '.') {
        row = parseInt(i/9);
        col = i%9;
        // console.log(`row: ${row}, col: ${col}`); //debug
        isDone = false;
        break;
      }
    }

    if (isDone) {return puzzleString;}

    for (let val = 1; val < 10; val++) {
      if (this.isSafe(puzzleString, row, col, String(val))) {
        let before = puzzleString.substring(0, i);
        let after = puzzleString.substring(i+1, puzzleString.length);
        puzzleString = before + String(val) + after;
        let ans = this.helper(puzzleString);
        if (ans != false) {
          // console.log(`Final answer: ${puzzleString}`); //debug
          return ans;
        } else {
          before = puzzleString.substring(0,i);
          after = puzzleString.substring(i+1, puzzleString.length);
          puzzleString = before + '.' + after;
        }
      }
    }
    return false;
  } // end helper
}

module.exports = SudokuSolver;

