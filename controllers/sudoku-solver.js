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
    console.log(`Row place: substring ${sub}`); //debug
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

  solve(puzzleString) {
    if (this.validate(puzzleString)) {
      var puzzleArr = [];
      for (var i = 0; i < puzzleString.length; i++) {
        if (puzzleString.charAt(i) === '.') {
          let row = parseInt(i/9);
          let col = i%9;
          for (var val = 1; val < 10; val++) {
            if (this.checkRowPlacement(puzzleString, row, col, val) && 
              this.checkColPlacement(puzzleString, row, col, val) && 
              this.checkRegionPlacement(puzzleString, row, col, val)) {
                puzzleArr.push(val);
            }
          }
        } else {
          puzzleArr.push(parseInt(puzzleString.charAt(i)));
        }
      }
      return puzzleArr.toString();
    }
  }
}

module.exports = SudokuSolver;

