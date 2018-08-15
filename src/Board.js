// It's part of the Board Visualizer

(function() {

    window.Board = Backbone.Model.extend({

        initialize: function(params) {
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
            this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
            // console.log('this is column', this._getFirstRowColumnIndexForMajorDiagonalOn(0, 0))
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
        
        hasRowConflictAt: function(rowIndex) {
            var currentRow = this.get(rowIndex);
            var counter = 0;
            // console.log('current row', currentRow)
            for (var i = 0; i < currentRow.length; i++) {
                //if there is something in the row
                if (currentRow[i] === 1) {
                    counter += 1;
                    // console.log('counter', counter)
                }
            }
            if (counter > 1) {
                return true;
            } else {
                return false;
            }
        },
        hasAnyRowConflicts: function() {
            for (var i = 0; i < this.get('n'); i++) {
                if (this.hasRowConflictAt(i)) {
                    return true;
                }
            }
            return false; 
        },
        
        hasColConflictAt: function(colIndex) {
            var counter = 0;
            var currentCol = this.get(colIndex);
            let obj = this.attributes;
            for (let key in obj) {
                if (obj[key][colIndex] === 1) {
                    counter++;
                }
                if (counter > 1) {
                    return true;
                }
            }

            return false;
        },
        hasAnyColConflicts: function() {
            for (var i = 0; i < this.get('n'); i++) {
                if (this.hasColConflictAt(i)) {
                    return true;
                }
            }
            return false; // fixme
        },
        hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
          var size = this.get('n');
          var count = 0;
          var rowIndex = 0;
          var colIndex = majorDiagonalColumnIndexAtFirstRow;
          for( ; rowIndex < size && colIndex < size; rowIndex++, colIndex++) {
            if(colIndex >= 0) {
              var row = this.get(rowIndex);
              count += row[colIndex];
            }
          }
          return count > 1;
        },

        // test if any major diagonals on this board contain conflicts
        hasAnyMajorDiagonalConflicts: function() {
            let obj = this.get('n');
            for (let i = 1 - obj; i < obj; i++) {
                if (this.hasMajorDiagonalConflictAt(i)) {
                    return true;
                }
            }
            return false; 
        },
        // test if a specific minor diagonal on this board contains a conflict
        hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
          var size = this.get('n');
          var count = 0;
          var rowIndex = 0;
          var colIndex = minorDiagonalColumnIndexAtFirstRow;
          for( ; rowIndex < size && colIndex >= 0; rowIndex++, colIndex--) {
            if(colIndex < size) {
              var row = this.get(rowIndex);
              count += row[colIndex];
            }
          }
          return count > 1;
          
          
            return false;
        },

        // test if any minor diagonals on this board contain conflicts
        hasAnyMinorDiagonalConflicts: function() {
          var obj = this.get('n');
          for(var i = (obj * 2) - 1; i >= 0; i--){
            if(this.hasMinorDiagonalConflictAt(i)) {
              return true;
            }
          } 
            
            return false; // fixme
        }
    });

    var makeEmptyMatrix = function(n) {
        return _(_.range(n)).map(function() {
            return _(_.range(n)).map(function() {
                return 0;
            });
        });
    };

}());
