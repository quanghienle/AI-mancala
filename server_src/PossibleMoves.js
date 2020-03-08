const config = require("../src/config");
const Node = require("./Node");

class PossibleMoves {
  constructor(currPlayer) {
    this.currPlayer = currPlayer;
  }

  getNextIndex = (currIndex, isClockwise) => {
    return isClockwise ? (currIndex + 1) % 24 : (currIndex + 23) % 24;
  };

  updateGrid = (op, grid, currIndex, stones) => {
    const mancalaPos = config.player[this.currPlayer].mancala;

    const updatedGrid = [...grid];
    updatedGrid[currIndex].numberOfStones = grid[currIndex].numberOfStones + op.put - op.take;
    updatedGrid[mancalaPos[0]].numberOfStones = grid[mancalaPos[0]].numberOfStones + op.take;
    const updatedStones = stones - op.put;

    return { updatedGrid, updatedStones };
  };

  getOption = (curr, grid, isSkip) => {
    let i = grid[curr].numberOfStones >= 1 ? 3 : 2;
    return isSkip ? config.options[0] : config.options[i];
  };

  getMancalas = grid => {
    return config.player[this.currPlayer].mancala.map(i => grid[i].numberOfStones);
  };

  makePath = (index, currStones, handStones, mancalaStones) => {
    return {
      index: index,
      numberOfStones: currStones,
      stonesInHand: handStones,
      mancalaStones: mancalaStones
    };
  };

  findSuccessors = (currList, path, grid, currIndex, stones, isClockwise, isSkip) => {
    this.result = null;
    this.path = null;
    this.lastIndex = null;

    const next = this.getNextIndex(currIndex, isClockwise);

    if (grid[currIndex].mancala && this.currPlayer !== grid[currIndex].player) {
      const op = this.getOption(currIndex, grid, isSkip);

      currList.push(op.label);

      const { updatedGrid, updatedStones } = this.updateGrid(op, grid, currIndex, stones);

      const node = this.makePath(
        currIndex,
        updatedGrid[currIndex].numberOfStones,
        updatedStones,
        this.getMancalas(updatedGrid)
      );
      path.push(node);

      return this.findSuccessors(
        currList,
        path,
        updatedGrid,
        next,
        updatedStones,
        isClockwise,
        isSkip
      );
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
        this.lastStoneBonus(currIndex, grid);
        this.result = grid;
        this.path = path;
        this.lastIndex = currIndex;

        currList.push("end");
        return currList;
      } else {
        grid[currIndex].numberOfStones = updatedStones;
        return this.findSuccessors(currList, path, grid, next, updatedHand, isClockwise, isSkip);
      }
    }
  };

  lastStoneBonus(currIndex, grid) {
    const neighbors = config.player[this.currPlayer].neighbors;
    let adjacents = neighbors.find(e => e.pos === currIndex);

    if (typeof adjacents !== "undefined" && grid[currIndex].numberOfStones === 1) {
      const stonesList = adjacents.adjacent.map(e => grid[e].numberOfStones);
      const maxStones = Math.max(...stonesList);
      const maxIndex = stonesList.indexOf(maxStones);
      const maxNeighbor = adjacents.adjacent[maxIndex];

      grid[maxNeighbor].numberOfStones = 0;

      const mancalaPos = config.player[this.currPlayer].mancala[0];
      grid[mancalaPos].numberOfStones = grid[mancalaPos].numberOfStones + maxStones;
    }
  }

  findAll = grid => {
    const moves = [];
    const clockwise = [
      [true, false],
      [true, false],
      [false, false],
      [false, false]
    ];

    grid.forEach((cell, index) => {
      if (cell.player === this.currPlayer && !cell.mancala && cell.numberOfStones > 0) {
        clockwise.forEach(c => {
          const clone1 = JSON.parse(JSON.stringify(grid));
          const clockwiseNode = this.findSuccessors(["start"], [], clone1, index, 0, c[0], c[1]);
          moves.push(
            new Node(
              index,
              true,
              this.currPlayer,
              this.path,
              clockwiseNode,
              this.result,
              this.lastIndex
            )
          );
        });
      }
    });
    return moves;
  };
}

module.exports = PossibleMoves;
