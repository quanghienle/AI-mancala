import React, { Component } from "react";
import Config from "./config";
import Info from "./components/Info";
import PopUp from "./components/PopUp";
import SideBar from "./components/SideBar";
import ExpressUtils from "./express_utils";
import Grid from "./components/Grid";
import "./App.css";

class App extends Component {
  state = {
    grid: null,
    playerTurn: Math.random() >= 0.5 ? "x" : "o",
    stonesInHand: 0,
    popUp: false,
    humanPlayer: true,
    activeCell: null,
    isClockwise: null,
    gameEnd: false
  };

  UNSAFE_componentWillMount() {
    console.log("=== SUCCESSFULLY CONNECTED TO BACKEND ===");
    ExpressUtils.get("/backend")
      .then(res => this.setState({ grid: res.grid }))
      .catch(err => console.log(err));
  }

  getBestMove = async (who, h) => {
    const reqObj = {
      player: who,
      type: h,
      gridArr: this.state.grid
    };

    const body = await ExpressUtils.post("/api", reqObj);
    console.log("node count: ", body.nodeCount);
    console.log("Best move: ", body.move);  
    this.setState({ node: body.move });
  };

  performTurn = async (who, h) => {
    if (this.state.playerTurn !== who || this.state.gameEnd) {
      return;
    }

    await this.getBestMove(who, h);

    let count = 0;

    const intervalId = setInterval(() => {
      const move = this.state.node.path[count];

      const mancalasPos = Config.player[this.state.playerTurn].mancala;

      this.clearActive();

      const updatedGrid = [...this.state.grid];
      
      updatedGrid[mancalasPos[0]].numberOfStones = move.mancalaStones[0];
      updatedGrid[mancalasPos[1]].numberOfStones = move.mancalaStones[1];
      updatedGrid[move.index].active = true;
      updatedGrid[move.index].numberOfStones = move.numberOfStones;

      this.setState({
        activeCell: move.index,
        isClockwise: null,
        stonesInHand: move.stonesInHand,
        grid: updatedGrid
      });

      count += 1;

      if (count === this.state.node.path.length) {
        clearInterval(intervalId);
        this.endTurn();
      }
    }, Config.speed);
  };

  updateCell(obj, cellNum) {
    const cell = this.state.grid[cellNum];
    const updatedCell = { ...cell, ...obj };
    this.setState(state => (state.grid[cellNum] = updatedCell));
  }

  clearActive() {
    this.state.grid.forEach((_, index) => this.updateCell({ active: false }, index));
  }

  gridOnClick(cellNum) {
    if (
      this.state.grid[cellNum].player === this.state.playerTurn &&
      !this.state.grid[cellNum].mancala &&
      this.state.stonesInHand === 0 &&
      !this.state.gameEnd &&
      this.state.humanPlayer &&
      this.state.playerTurn === "x"
    ) {
      this.clearActive();

      const stones = this.state.grid[cellNum].numberOfStones;
      this.updateCell({ active: true, numberOfStones: 0 }, cellNum);
      this.setState({ stonesInHand: stones, activeCell: cellNum });
    }
  }

  gameEnd() {
    let sum_x,
      sum_o = 0;

    this.state.grid
      .filter(cell => !cell.mancala)
      .forEach(cell => {
        cell.player === "o" ? (sum_o += cell.numberOfStones) : (sum_x += cell.numberOfStones);
      });

    if (sum_x === 0 || sum_o === 0) {
      this.setState({ gameEnd: true });
    }
  }

  getNext(curr, isClockwise) {
    return isClockwise ? (curr + 1) % 24 : (curr + 23) % 24;
  }

  endTurn() {
    this.gameEnd();

    if (!this.state.gameEnd) {
      if (Config.player[this.state.playerTurn].mancala.includes(this.state.activeCell)) {
        console.log("Ended at mancala. Continue playing.");
        return;
      }
      const nextPlayer = this.state.playerTurn === "x" ? "o" : "x";
      this.setState({ playerTurn: nextPlayer, popUp: false });
    }
  }

  stealStones(op) {
    if (this.state.gameEnd) {
      return;
    }

    // if no skip
    if (op.put !== 0) {
      const curr = this.state.activeCell;

      const currPlayer = this.state.playerTurn;
      const playerMancalas = Config.player[currPlayer].mancala;
      const isMin =
        this.state.grid[playerMancalas[0]].numberOfStones <
        this.state.grid[playerMancalas[1]].numberOfStones;

      const min = isMin ? playerMancalas[0] : playerMancalas[1];

      const opStones = this.state.grid[curr].numberOfStones;
      const minMancalaStones = this.state.grid[min].numberOfStones;

      this.updateCell({ numberOfStones: opStones - op.take + 1 }, curr);
      this.updateCell({ numberOfStones: minMancalaStones + op.take }, min);
      this.setState({ stonesInHand: this.state.stonesInHand - 1 });
    }

    this.playTurn(this.state.isClockwise);
  }

  playTurn(isClockwise) {
    if (this.state.gameEnd) {
      return;
    }

    this.setState({ popUp: false, isClockwise: isClockwise });

    const intervalId = setInterval(() => {
      if (this.state.stonesInHand === 0) {
        clearInterval(intervalId);
        this.endTurn();
        return;
      }

      const next = this.getNext(this.state.activeCell, isClockwise);
      let updatedStones = this.state.grid[next].numberOfStones + 1;
      let updatedHand = this.state.stonesInHand - 1;

      if (updatedHand === 0 && updatedStones > 1 && !this.state.grid[next].mancala) {
        updatedHand = updatedStones;
        updatedStones = 0;
      }

      this.clearActive();
      this.updateCell({ active: true }, next);
      this.setState({ activeCell: next });

      const isOpMancala =
        this.state.grid[next].mancala && this.state.grid[next].player !== this.state.playerTurn;

      if (isOpMancala) {
        this.setState({ popUp: true });
        clearInterval(intervalId);
      } else {
        this.updateCell({ numberOfStones: updatedStones }, next);
        this.setState({ stonesInHand: updatedHand });
      }

      if (
        updatedHand <= 0 &&
        (updatedStones === 1 || this.state.grid[next].mancala) &&
        !isOpMancala
      ) {
        clearInterval(intervalId);
        this.endTurn();
      }
    }, Config.speed);
  }

  render() {
    return (
      <div className="App">
        <div className="info-container">
          <SideBar
            humanPlayer={this.state.humanPlayer}
            playerTurn={this.state.playerTurn}
            performTurn={this.performTurn.bind(this)}
            playTurn={this.playTurn.bind(this)}
          />
          <PopUp
            visible={this.state.popUp}
            grid={this.state.grid}
            activeCell={this.state.activeCell}
            onClick={this.stealStones.bind(this)}
          />
        </div>
        <div
          className="grid-container"
          style={{
            width: Config.cellHeight * 8,
            height: Config.cellHeight * 8,
            backgroundSize: `${Config.cellHeight}px ${Config.cellHeight}px`
          }}
        >
          <Grid grid={this.state.grid} onClick={this.gridOnClick.bind(this)} />
          <Info
            gameEnd={this.state.gameEnd}
            grid={this.state.grid}
            stonesInHand={this.state.stonesInHand}
            playerTurn={this.state.playerTurn}
          />
        </div>
      </div>
    );
  }
}

export default App;
