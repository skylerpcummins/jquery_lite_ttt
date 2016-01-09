var View = require('./ttt-view');
var Game = require('../logic/game');

// $(function () {
//   // Your code here
//   var testGame = new Game();
//   var $containerEl = $('.ttt');
//   new View(testGame, $containerEl);
//
// });

window.$l(function() {
  var testGame = new Game();
  var $containerEl = window.$l('.ttt');
  new View(testGame, $containerEl);
});
