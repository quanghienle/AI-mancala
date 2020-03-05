import React, { Component } from "react";
import Cell from "./components/Cell";
import Config from "./config";
import { Spinner } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import "./App.css";

class App extends Component {
  state = {
    grid: null,
    playerTurn: Math.random() >= 0.5 ? "x" : "o",
    stonesInHand: 0,
    popUp: false,
    activeCell: null,
    isClockwise: null
  };

  UNSAFE_componentWillMount() {
    console.log("=== SUCCESSFULLY CONNECTED TO BACKEND ===");
    this.callBackendAPI("/backend")
      .then(res => {
        this.setState({ grid: res.grid });
      })
      .catch(err => console.log(err));
  }
  callBackendAPI = async endpoint => {
    const response = await fetch(endpoint);
    const body = await response.json();
    return body;
  };

  ex = {
    index: 0,
    isClockwise: true,
    opList: [
      { label: "place 1 & take 1", put: 1, take: 1 },
      { label: "place 1 & take 1", put: 1, take: 1 }
    ],
    cost: 49,
    path: [
      { index: 0, numberOfStones: 0, stonesInHand: 5 },
      { index: 1, numberOfStones: 6, stonesInHand: 4 },
      { index: 2, numberOfStones: 1, stonesInHand: 3 },
      { index: 3, numberOfStones: 6, stonesInHand: 2 },
      { index: 4, numberOfStones: 6, stonesInHand: 1 },
      { index: 5, numberOfStones: 0, stonesInHand: 6 },
      { index: 6, numberOfStones: 6, stonesInHand: 5 },
      { index: 7, numberOfStones: 6, stonesInHand: 4 },
      { index: 8, numberOfStones: 0, stonesInHand: 4 },
      { index: 9, numberOfStones: 6, stonesInHand: 3 },
      { index: 10, numberOfStones: 6, stonesInHand: 2 },
      { index: 11, numberOfStones: 6, stonesInHand: 1 },
      { index: 12, numberOfStones: 0, stonesInHand: 6 },
      { index: 13, numberOfStones: 6, stonesInHand: 5 },
      { index: 14, numberOfStones: 1, stonesInHand: 4 },
      { index: 15, numberOfStones: 6, stonesInHand: 3 },
      { index: 16, numberOfStones: 6, stonesInHand: 2 },
      { index: 17, numberOfStones: 6, stonesInHand: 1 },
      { index: 18, numberOfStones: 0, stonesInHand: 6 },
      { index: 19, numberOfStones: 6, stonesInHand: 5 },
      { index: 20, numberOfStones: 0, stonesInHand: 5 },
      { index: 21, numberOfStones: 6, stonesInHand: 4 },
      { index: 22, numberOfStones: 6, stonesInHand: 3 },
      { index: 23, numberOfStones: 6, stonesInHand: 2 },
      { index: 0, numberOfStones: 1, stonesInHand: 1 },
      { index: 1, numberOfStones: 0, stonesInHand: 7 },
      { index: 2, numberOfStones: 2, stonesInHand: 6 },
      { index: 3, numberOfStones: 7, stonesInHand: 5 },
      { index: 4, numberOfStones: 7, stonesInHand: 4 },
      { index: 5, numberOfStones: 1, stonesInHand: 3 },
      { index: 6, numberOfStones: 7, stonesInHand: 2 },
      { index: 7, numberOfStones: 7, stonesInHand: 1 },
      { index: 8, numberOfStones: 0, stonesInHand: 1 },
      { index: 9, numberOfStones: 0, stonesInHand: 7 },
      { index: 10, numberOfStones: 7, stonesInHand: 6 },
      { index: 11, numberOfStones: 7, stonesInHand: 5 },
      { index: 12, numberOfStones: 1, stonesInHand: 4 },
      { index: 13, numberOfStones: 7, stonesInHand: 3 },
      { index: 14, numberOfStones: 2, stonesInHand: 2 },
      { index: 15, numberOfStones: 7, stonesInHand: 1 },
      { index: 16, numberOfStones: 0, stonesInHand: 7 },
      { index: 17, numberOfStones: 7, stonesInHand: 6 },
      { index: 18, numberOfStones: 1, stonesInHand: 5 },
      { index: 19, numberOfStones: 7, stonesInHand: 4 },
      { index: 20, numberOfStones: 0, stonesInHand: 4 },
      { index: 21, numberOfStones: 7, stonesInHand: 3 },
      { index: 22, numberOfStones: 7, stonesInHand: 2 },
      { index: 23, numberOfStones: 7, stonesInHand: 1 },
      { index: 0, numberOfStones: 0, stonesInHand: 2 },
      { index: 1, numberOfStones: 1, stonesInHand: 1 },
      { index: 2, numberOfStones: 3, stonesInHand: 0 }
    ]
  };

  performTurn() {
    let count = 0;
    const end = this.ex.path.length;

    const intervalId = setInterval(() => {
      const cellNum = this.ex.path[count].index;
      const numStones = this.ex.path[count].numberOfStones;
      const hand = this.ex.path[count].stonesInHand;

      this.clearActive();
      this.updateCell({ active: true, numberOfStones: numStones }, cellNum);
      this.setState({ activeCell: cellNum, stonesInHand: hand });

      count += 1;
      if (count === end) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  handleOnclick = async index => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        player: "x",
        gridArr: this.state.grid
      })
    });
    const body = await response.json();
    console.log("Path: ", body.path);
  };

  updateCell(obj, cellNum) {
    const cell = this.state.grid[cellNum];
    const updatedCell = { ...cell, ...obj };
    this.setState(state => (state.grid[cellNum] = updatedCell));
  }

  clearActive() {
    this.state.grid.forEach((_, index) => this.updateCell({ active: false }, index));
  }

  onClick(cellNum) {
    if (
      this.state.grid[cellNum].player === this.state.playerTurn &&
      !this.state.grid[cellNum].mancala &&
      this.state.stonesInHand === 0
    ) {
      this.clearActive();
      this.setState({ activeCell: cellNum });

      const stones = this.state.grid[cellNum].numberOfStones;
      this.updateCell({ active: true, numberOfStones: 0 }, cellNum);
      this.setState({ stonesInHand: stones });
    }
  }

  getNext(curr, isClockwise) {
    return isClockwise ? (curr + 1) % 24 : (curr + 23) % 24;
  }

  endTurn() {
    const nextPlayer = this.state.playerTurn === "x" ? "o" : "x";
    this.setState({ playerTurn: nextPlayer, popUp: false });
  }

  stealStones(op) {
    const num = op.take;
    const isSkip = op.put === 0;

    if (isSkip) {
      this.playTurn(this.state.isClockwise);
      return;
    }

    const curr = this.state.activeCell;

    const currPlayer = this.state.playerTurn;
    const playerMancalas = Config.player[currPlayer].mancala;
    const isMin = this.state.grid[playerMancalas[0]].numberOfStones < this.state.grid[playerMancalas[1]].numberOfStones;

    const min = isMin ? playerMancalas[0] : playerMancalas[1];

    const opStones = this.state.grid[curr].numberOfStones;
    const minMancalaStones = this.state.grid[min].numberOfStones;

    this.updateCell({ numberOfStones: opStones - num + 1 }, curr);
    this.updateCell({ numberOfStones: minMancalaStones + num }, min);
    this.setState({ stonesInHand: this.state.stonesInHand - 1 });
    this.playTurn(this.state.isClockwise);
  }

  playTurn(isClockwise) {
    if (this.state.stonesInHand !== 0) {
      this.setState({ popUp: false });
      this.setState({ isClockwise: isClockwise });
      const intervalId = setInterval(() => {
        const next = this.getNext(this.state.activeCell, isClockwise);
        const stones = this.state.stonesInHand;
        let updatedStones = this.state.grid[next].numberOfStones + 1;
        let updatedHand = stones - 1;

        if (updatedHand === 0 && updatedStones > 1 && !this.state.grid[next].mancala) {
          updatedHand = updatedStones;
          updatedStones = 0;
        }

        this.clearActive();
        this.updateCell({ active: true }, next);
        this.setState({ activeCell: next });

        if (this.state.grid[next].mancala && this.state.grid[next].player !== this.state.playerTurn) {
          this.setState({ popUp: true, stonesInHand: stones });
          clearInterval(intervalId);
        } else {
          this.updateCell({ numberOfStones: updatedStones }, next);
          this.setState({ stonesInHand: updatedHand });
        }

        if (updatedHand <= 0 && (updatedStones === 1 || this.state.grid[next].mancala)) {
          clearInterval(intervalId);
          this.endTurn();
        }
      }, 1000);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="info-container">
          <Button variant="outlined" onClick={() => this.playTurn(true)}>
            Clockwise
          </Button>
          <Button variant="outlined" onClick={() => this.playTurn(false)}>
            Counter-clockwise
          </Button>
          <Button variant="outlined" onClick={() => this.handleOnclick(1)}>
            Computer Play
          </Button>
          <Button variant="outlined" onClick={this.performTurn.bind(this)}>
            Perform
          </Button>

          {this.state.popUp ? (
            <div className="pop-up">
              {Config.options.map((op, index) => (
                <Button key={index} variant="contained" color="primary" onClick={() => this.stealStones(op)}>
                  {op.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="pop-up" />
          )}
        </div>
        <div
          className="grid-container"
          style={{
            width: Config.cellHeight * 8,
            height: Config.cellHeight * 8,
            backgroundSize: `${Config.cellHeight}px ${Config.cellHeight}px`
          }}
        >
          {this.state.grid === null ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            this.state.grid.map((cell, index) => {
              return (
                <Cell
                  key={index}
                  cellState={cell}
                  onClick={() => {
                    this.onClick(index);
                  }}
                />
              );
            })
          )}
          <h3>Stones in hand: {this.state.stonesInHand}</h3>
          <h3>{Config.player[this.state.playerTurn].name}</h3>
        </div>
      </div>
    );
  }
}

export default App;
