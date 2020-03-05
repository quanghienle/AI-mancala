const config = require("../src/config");

class PossibleMoves {
  constructor(currPlayer, heuristic) {
    this.currPlayer = currPlayer;
    this.heuristic = heuristic;
  }

  getNextIndex = (currIndex, isClockwise) => {
    return isClockwise ? (currIndex + 1) % 24 : (currIndex + 23) % 24;
  };

  updateGrid = (op, grid, currIndex, stones) => {
    const updatedGrid = [...grid];
    updatedGrid[currIndex].numberOfStones = grid[currIndex].numberOfStones + op.put - op.take;
    const updatedStones = stones - op.put;

    return { updatedGrid, updatedStones };
  };

  getOption = (curr, next, grid, stones) => {
    let i = 2;
    if (grid[next].numberOfStones === 0 && stones === 1) {
      i = 0;
    } else if (grid[curr].numberOfStones >= 1) {
      i = 3;
    }

    return config.options[i];
  };

  makePath = (index, currStones, handStones) => {
      return {
          index: index,
          numberOfStones: currStones,
          stonesInHand: handStones,
      }
  }

  findSuccessors = (currList, path, grid, currIndex, stones, isClockwise) => {
    this.result = null;
    this.path=null;
    const next = this.getNextIndex(currIndex, isClockwise);

    if (grid[currIndex].mancala && this.currPlayer !== grid[currIndex].player) {
      const op = this.getOption(currIndex, next, grid, stones);

      currList.push(op);

      const { updatedGrid, updatedStones } = this.updateGrid(op, grid, currIndex, stones);

      const node = this.makePath(currIndex, updatedGrid[currIndex].numberOfStones, updatedStones);
      path.push(node);

      return this.findSuccessors(currList, path, updatedGrid, next, updatedStones, isClockwise);
    } else {
      let updatedStones = grid[currIndex].numberOfStones + 1;
      let updatedHand = stones - 1;

      if (updatedHand <= 0 && updatedStones > 1 && !grid[currIndex].mancala) {
        updatedHand = updatedStones + updatedHand;
        updatedStones = 0;
      }
      const node = this.makePath(currIndex, updatedStones, updatedHand);
      path.push(node);

      if (updatedHand <= 0 && (updatedStones === 1 || grid[currIndex].mancala)) {

        this.result = grid;
        this.path = path;
        console.log(path);
        return currList;
      } else {
        grid[currIndex].numberOfStones = updatedStones;
        //   console.log(currIndex, newGrid[currIndex].numberOfStones, updatedHand);
        return this.findSuccessors(currList, path, grid, next, updatedHand, isClockwise);
      }
    }
  };

  createNode = (index, isClockwise, path, opList, grid) => {
    return {
      index: index,
      isClockwise: isClockwise,
      path: path,
      opList: opList,
      score: this.heuristic(grid, this.currPlayer)
    };
  };


  findAll = grid => {
    const moves = [];

    grid.forEach((cell, index) => {
      if (cell.player === this.currPlayer && !cell.mancala) {

        const clone1 = JSON.parse(JSON.stringify(grid));
        const clockwiseNode = this.findSuccessors([], [], clone1, index, 0, true);
        moves.push(this.createNode(index, true, this.path, clockwiseNode, this.result))

        const clone2 = JSON.parse(JSON.stringify(grid));
        const counterNode = this.findSuccessors([], [], clone2, index, 0, false);
        moves.push(this.createNode(index, false, this.path, counterNode, this.result));
      }
    });
    return moves;
  };
}

module.exports = PossibleMoves;
