var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
  this.setupBoard();
  this.bindEvents();
};

View.prototype.bindEvents = function () {
  this.$grid.on("click", '.square', function(e){
    var $thisSquare = $(e.currentTarget);
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
  // $square.text(this.game.currentPlayer);
};

View.prototype.setupBoard = function () {
  console.log("in setupBoard");
  this.$grid = $("<ul>").addClass("grid");
  for (var i = 0; i < 3; i++) {
    // this.$grid.addRow();
    for (var j = 0; j < 3; j++) {
      var $square = $("<li>").addClass("square").data("id", [i, j]);
      console.log("in addRow for loop");
      this.$grid.append($square);
    }
  }
  this.$el.append(this.$grid);
};

// View.prototype.addRow = function () {
//   console.log("in addRow");
//   for (var i = 0; i < 3; i++) {
//     var $square = $("<li>").addClass("square");
//     console.log("in addRow for loop");
//     this.$grid.append($square);
//   }
// };

module.exports = View;
