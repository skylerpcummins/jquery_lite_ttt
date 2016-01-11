(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var View = require('./ttt-view');
var Game = require('../logic/game');

window.$l(function() {
  var testGame = new Game();
  var $containerEl = window.$l('.ttt');
  new View(testGame, $containerEl);
});

},{"../logic/game":4,"./ttt-view":2}],2:[function(require,module,exports){
var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
  this.setupBoard();
  this.bindEvents();
};

View.prototype.bindEvents = function () {
  window.$l('li').on('click', function(e){
    var pos = [];
    var $square = window.$l(e.currentTarget)
    var pos = this.generatePos($square);
    var moveValidity = this.game.playMove(pos);
    if (moveValidity) {
      this.makeMove($square);
      if (this.game.isOver()) {
        if (this.game.board.winner() !== null) {
          alert(this.game.board.winner() + " wins!");
        } else {
          alert("Cat's game!");
        }
      }
      this.game.swapTurn();
    }
    else {
      alert("That was an invalid move!");
    }
  }.bind(this));
};

View.prototype.generatePos = function($square) {
  var pos = [];
  var posString = $square.attr('position');
  pos[0] = parseInt(posString[0]);
  pos[1] = parseInt(posString[2]);

  return pos;
};

View.prototype.makeMove = function ($square) {
  if (this.game.currentPlayer === 'x') {
    $square.addClass("ben")
    $square.addClass('clicked');
  } else {
    $square.addClass("thomas")
    $square.addClass('clicked');
  }
};

View.prototype.setupBoard = function () {
  this.$grid = window.$l('ul');
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      this.$grid.append('li');
      var $square = window.$l('ul').lastChild();
      $square.attr('position', [i, j]);
      $square.addClass('square');
    }
  }
};

module.exports = View;

},{}],3:[function(require,module,exports){
var MoveError = require("./moveError");

function Board () {
  this.grid = Board.makeGrid();
}

Board.isValidPos = function (pos) {
  return (
    (0 <= pos[0]) && (pos[0] < 3) && (0 <= pos[1]) && (pos[1] < 3)
  );
};

Board.makeGrid = function () {
  var grid = [];

  for (var i = 0; i < 3; i++) {
    grid.push([]);
    for (var j = 0; j < 3; j++) {
      grid[i].push(null);
    }
  }

  return grid;
};

Board.marks = ["x", "o"];

Board.prototype.isEmptyPos = function (pos) {
  if (!Board.isValidPos(pos)) {
    throw new MoveError("Is not valid position!");
  }

  return (this.grid[pos[0]][pos[1]] === null);
};

Board.prototype.isOver = function () {
  if (this.winner() != null) {
    return true;
  }

  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
    for (var colIdx = 0; colIdx < 3; colIdx++) {
      if (this.isEmptyPos([rowIdx, colIdx])) {
        return false;
      }
    }
  }

  return true;
};

Board.prototype.placeMark = function (pos, mark) {
  if (!this.isEmptyPos(pos)) {
    throw new MoveError("Is not an empty position!");
  }

  this.grid[pos[0]][pos[1]] = mark;
  return true;
};

Board.prototype.print = function () {
  var strs = [];
  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
    var marks = [];
    for (var colIdx = 0; colIdx < 3; colIdx++) {
      marks.push(
        this.grid[rowIdx][colIdx] ? this.grid[rowIdx][colIdx] : " "
      );
    }

    strs.push(marks.join("|") + "\n");
  }

  console.log(strs.join("-----\n"));
};

Board.prototype.winner = function () {
  var posSeqs = [
    // horizontals
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // verticals
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[2, 0], [1, 1], [0, 2]]
  ];

  for (var i = 0; i < posSeqs.length; i++) {
    var winner = this.winnerHelper(posSeqs[i]);
    if (winner != null) {
      return winner;
    }
  }

  return null;
};

Board.prototype.winnerHelper = function (posSeq) {
  for (var markIdx = 0; markIdx < Board.marks.length; markIdx++) {
    var targetMark = Board.marks[markIdx];
    var winner = true;
    for (var posIdx = 0; posIdx < 3; posIdx++) {
      var pos = posSeq[posIdx];
      var mark = this.grid[pos[0]][pos[1]];

      if (mark != targetMark) {
        winner = false;
      }
    }

    if (winner) {
      return targetMark;
    }
  }

  return null;
};

module.exports = Board;

},{"./moveError":5}],4:[function(require,module,exports){
var Board = require("./board");
var MoveError = require("./moveError");

function Game () {
  this.board = new Board();
  this.currentPlayer = Board.marks[0];
}

Game.prototype.isOver = function () {
  return this.board.isOver();
};

Game.prototype.playMove = function (pos) {
  return this.board.placeMark(pos, this.currentPlayer);
};

Game.prototype.promptMove = function (reader, callback) {
  var game = this;

  this.board.print();
  console.log("Current Turn: " + this.currentPlayer)

  reader.question("Enter rowIdx: ", function (rowIdxStr) {
    var rowIdx = parseInt(rowIdxStr);
    reader.question("Enter colIdx: ", function (colIdxStr) {
      var colIdx = parseInt(colIdxStr);
      callback([rowIdx, colIdx]);
    });
  });
};

Game.prototype.run = function (reader, gameCompletionCallback) {
  this.promptMove(reader, (function (move) {
    try {
      this.playMove(move);
    } catch (e) {
      if (e instanceof MoveError) {
        console.log(e.msg);
      } else {
        throw e;
      }
    }

    if (this.isOver()) {
      this.board.print();
      if (this.winner()) {
        debugger;
        console.log(this.winner() + " has won!");
      } else {
        console.log("NO ONE WINS!");
      }
      gameCompletionCallback();
    } else {
      this.run(reader, gameCompletionCallback);
    }
  }).bind(this));
};

Game.prototype.swapTurn = function () {
  if (this.currentPlayer === Board.marks[0]) {
    this.currentPlayer = Board.marks[1];
  } else {
    this.currentPlayer = Board.marks[0];
  }
};

Game.prototype.winner = function () {
  return this.board.winner();
};

module.exports = Game;

},{"./board":3,"./moveError":5}],5:[function(require,module,exports){
function MoveError (msg) {
  this.msg = msg;
}

module.exports = MoveError;

},{}]},{},[1]);
