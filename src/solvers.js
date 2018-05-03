/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findSolution = function(row, n, board, validator, callback) {
    if (row === n) {
        return callback();

    }
    for (let i = 0; i < n; i++) {
        board.togglePiece(row, i);
        if (!board[validator]()) {
            findSolution(row + 1, n, board, validator, callback)
        }
        board.togglePiece(row, i)
    }
}

window.findNRooksSolution = function(n) {
    var solution = new Board({
        n: n
    });

    // let possibleSolutions = new Board{matrix};
    for (let rowIndex = 0; rowIndex < n; rowIndex++) {
        for (let colIndex = 0; colIndex < n; colIndex++) {
            solution.togglePiece(rowIndex, colIndex);
            if (solution.hasAnyRooksConflicts()) {
                solution.togglePiece(rowIndex, colIndex);
            }
        }


    }
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
    return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
    var solutionCount = 0; //fixme
    var solution = new Board({
        n: n
    });
    var inner = function(row) {
        if (row === n) {
            solutionCount += 1;
            return;
        }
        for (var i = 0; i < n; i++) {
            solution.togglePiece(row, i)
            if (!solution.hasAnyRooksConflicts()) {
                inner(row + 1);
            }
            solution.togglePiece(row, i);
        }
    }
    inner(0);

    console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
    return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
    var board = new Board({
        n: n
    })
    var solution = board.rows();
    findSolution(0, n, board, "hasAnyQueensConflicts", function() {
        solution = _.map(board.rows(), function(row) {
            return row.slice();
        });
    })


    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
    var solutionCount = 0;
    var solution = new Board({
        n: n
    });
    var inner = function(row) {
        if (row === n) {
            solutionCount += 1;
            return;
        }
        for (var i = 0; i < n; i++) {
            solution.togglePiece(row, i)
            if (!solution.hasAnyQueensConflicts()) {
                inner(row + 1);
            }
            solution.togglePiece(row, i);
        }
    }
    inner(0);

    console.log('Number of solutions for ' + n + ' queens:', solutionCount);
    return solutionCount;
};