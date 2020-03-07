const config = require("../src/config");
const Node = require("./Node")

class PossibleMoves {
  constructor(currPlayer) {
    this.currPlayer = currPlayer;
  }

  getNextIndex = (currIndex, isClockwise) => {
    return isClockwise ? (currIndex + 1) % 24 : (currIndex + 23) % 24;
  };

  updateGrid = (op, grid, currIndex, stones) => {
    const mancalaPos = config.player[this.currPlayer].mancala;
    const first = grid[mancalaPos[0]].numberOfStones;
    const second = grid[mancalaPos[1]].numberOfStones;

    const min = first < second ? mancalaPos[0] : mancalaPos[1];

    const updatedGrid = [...grid];
    updatedGrid[currIndex].numberOfStones = grid[currIndex].numberOfStones + op.put - op.take;
    updatedGrid[min].numberOfStones = grid[min].numberOfStones + op.take;
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

  getMancalas = grid => {
    const mancalaPos = config.player[this.currPlayer].mancala;
    const first = grid[mancalaPos[0]].numberOfStones;
    const second = grid[mancalaPos[1]].numberOfStones;

    return [first, second];
  };

  makePath = (index, currStones, handStones, mancalaStones) => {
    return {
      index: index,
      numberOfStones: currStones,
      stonesInHand: handStones,
      mancalaStones: mancalaStones
    };
  };

  findSuccessors = (currList, path, grid, currIndex, stones, isClockwise) => {
    this.result = null;
    this.path = null;
    this.lastIndex = null;

    const next = this.getNextIndex(currIndex, isClockwise);

    if (grid[currIndex].mancala && this.currPlayer !== grid[currIndex].player) {
      const op = this.getOption(currIndex, next, grid, stones);

      currList.push(op.label);

      const { updatedGrid, updatedStones } = this.updateGrid(op, grid, currIndex, stones);

      const node = this.makePath(
        currIndex,
        updatedGrid[currIndex].numberOfStones,
        updatedStones,
        this.getMancalas(updatedGrid)
      );
      path.push(node);

      return this.findSuccessors(currList, path, updatedGrid, next, updatedStones, isClockwise);
    } else {
      let updatedStones = grid[currIndex].numberOfStones + 1;
      let updatedHand = stones - 1;

      if (updatedHand <= 0 && updatedStones > 1 && !grid[currIndex].mancala) {
        updatedHand = updatedStones + updatedHand;
        updatedStones = 0;
      }

      const node = this.makePath(currIndex, updatedStones, updatedHand, this.getMancalas(grid));
      path.push(node);

      if (updatedHand <= 0 && (updatedStones === 1 || grid[currIndex].mancala)) {
        this.result = grid;
        this.path = path;
        this.lastIndex = currIndex;

        currList.push("end");
        return currList;
      } else {
        grid[currIndex].numberOfStones = updatedStones;
        return this.findSuccessors(currList, path, grid, next, updatedHand, isClockwise);
      }
    }
  };

  createNode = (index, isClockwise, path, opList, grid, lastIndex) => {
    return {
      index: index,
      isClockwise: isClockwise,
      player: this.currPlayer,
      path: path,
      opList: opList,
      grid: grid,
    };
  };

  findAll = grid => {
    const moves = [];

    grid.forEach((cell, index) => {
      if (cell.player === this.currPlayer && !cell.mancala && cell.numberOfStones>0) {
        const clone1 = JSON.parse(JSON.stringify(grid));
        const clockwiseNode = this.findSuccessors(["start"], [], clone1, index, 0, true);
        moves.push(
          new Node(index, true, this.currPlayer, this.path, clockwiseNode, this.result, this.lastIndex)
        );

        const clone2 = JSON.parse(JSON.stringify(grid));
        const counterNode = this.findSuccessors(["start"], [], clone2, index, 0, false);
        moves.push(
          new Node(index, false, this.currPlayer, this.path, counterNode, this.result, this.lastIndex)
        );
      }
    });
    return moves;
  };
}

module.exports = PossibleMoves;
