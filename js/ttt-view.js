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
