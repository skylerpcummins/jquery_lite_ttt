var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
  this.setupBoard();
  this.bindEvents();
};

View.prototype.bindEvents = function () {
  window.$l('li').on('click', function(e){
    debugger;
    var $thisSquare = window.$l(e.currentTarget);
    var moveValidity = this.game.playMove($thisSquare.data("id"));
    if (moveValidity) {
      this.makeMove($thisSquare);
      if (this.game.isOver()) {
        alert(this.game.board.winner() + " wins!");
      }
      this.game.swapTurn();
    }
    else {
      alert("That was an invalid move!");
    }
  }.bind(this));
};

View.prototype.makeMove = function ($square) {
  if (this.game.currentPlayer === 'x') {
    $square.addClass("ben").addClass('clicked');
  } else {
    $square.addClass("thomas").addClass('clicked');
  }
};

View.prototype.setupBoard = function () {
  this.$grid = window.$l('ul');
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      this.$grid.append('li');
      var $square = window.$l('ul').lastChild();
      $square.addClass('square');
    }
  }
};

module.exports = View;
