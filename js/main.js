var View = require('./ttt-view');
var Game = require('../logic/game');

window.$l(function() {
  var testGame = new Game();
  var $containerEl = window.$l('.ttt');
  new View(testGame, $containerEl);
});
