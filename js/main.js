var View = require('./ttt-view');
var Game = require('../../ttt-core-solution/game');

$(function () {
  // Your code here
  var testGame = new Game();
  var $containerEl = $('.ttt');
  new View(testGame, $containerEl);

});
