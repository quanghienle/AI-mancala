
module.exports = class Node {
  constructor(index, isClockwise, player, path, opList, grid, lastIndex) {
    this.index = index;
    this.isClockwise = isClockwise;
    this.player = player;
    this.path = path;
    this.opList = opList;
    this.grid = grid;
    this.lastIndex = lastIndex;
  }

  getSuccessors() {
    const Move = require("./PossibleMoves");
    const getMove = new Move(this.player);
    return getMove.findAll(this.grid);
  }
};
