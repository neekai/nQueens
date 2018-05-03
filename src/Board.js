// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      console.log('this is column', this._getFirstRowColumnIndexForMajorDiagonalOn(0, 0))
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var currentRow = this.get(rowIndex);
      var counter = 0; 
      // console.log('current row', currentRow)
      for(var i = 0; i < currentRow.length; i++){
        //if there is something in the row
        if(currentRow[i] === 1){
          counter += 1; 
          // console.log('counter', counter)
        }
      }
        if(counter > 1){
          return true;
        } else{
          return false;
        }
      },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.get('n'); i++){
        if(this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
     var counter = 0;
     var currentCol = this.get(colIndex);
     let obj = this.attributes;
     for (let key in obj) {
      if(obj[key][colIndex] === 1) {
        counter++;
      }
      if(counter > 1) {
        return true;
      }
     }

        return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for(var i = 0; i < this.get('n'); i++){
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
  var counter = 0;
  let obj = this.attributes;
  console.log('obj', obj)
  for (let key in obj) {
    if(obj[key][majorDiagonalColumnIndexAtFirstRow] === 1) {
      if(obj[key][majorDiagonalColumnIndexAtFirstRow + 1] ===1) {
        counter++;
      }
      
    }
  }
  
  
  //   // let board = this.rows()
  //   // let counter = 0;
  //   // let colIndex, rowIndex, coords
  //   // var temp = majorDiagonalColumnIndexAtFirstRow; 
  //   // console.log('test', this.get(majorDiagonalColumnIndexAtFirstRow))
  //   // for(let i = 0; i < this.get('n'); i++) {
  //   //   rowIndex = i;
  //   //   for(let j = 0; j < this.get('n'); j++) {
  //   //     colIndex = j; coords = colIndex - rowIndex;
  //   //     // console.log('getFirstRowColumnIndexForMajorDiagonalOn', this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex))
  //   //     console.log('element at start of diagonal', board[i][j], 'element at next diagonal position', board[i+1][j + 1])
  //   //     // console.log( 'rowIndex',rowIndex, 'colIndex', colIndex, 'coords', coords, 'majorDiagonalColumnIndexAtFirstRow', temp)
  //   //     if (board[i][j] ===1 && board[i + 1][j + 1] === 1) {
  //   //       counter++;
  //   //     }    
  //   //   }
  //   // }
  //   // if(counter > 1) {
  //   //   return true;
  //   // }
    
        return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // let n = this.get('n')
      // for(let i = 0; i < n; i++) {
      // if(this.hasMajorDiagonalConflictAt(i)) {
      //   return true;
      // }
      return false; // fixme
      // }
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
