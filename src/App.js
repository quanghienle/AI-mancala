import React, { Component } from "react";
import Cell from "./components/Cell";
import Config from "./config";
import { Spinner } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import "./App.css";

class App extends Component {
  state = {
    grid: null,
    playerTurn: Math.random() >= 0.5 ? 'x' : 'o',
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

  updateCell(obj, cellNum) {
    const cell = this.state.grid[cellNum];
    const updatedCell = { ...cell, ...obj };
    this.setState(state => (state.grid[cellNum] = updatedCell));
  }

  clearActive() {
    this.state.grid.forEach((_, index) =>
      this.updateCell({ active: false }, index)
    );
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
      this.setState({ stonesInHand: stones });
      this.updateCell({ active: true, numberOfStones: 0 }, cellNum);
    }
  }

  getNext(curr, isClockwise) {
    return isClockwise ? (curr + 1) % 24 : (curr + 23) % 24;
  }

  endTurn() {
    const nextPlayer = this.state.playerTurn === "x" ? "o" : "x";
    this.setState({ playerTurn: nextPlayer });
  }

  stealStones(num) {
    const curr = this.state.activeCell;

    const currPlayer = this.state.playerTurn;
    const playerMancalas = Config.player[currPlayer].mancala;
    const m1 = this.state.grid[playerMancalas[0]].numberOfStones;
    const m2 = this.state.grid[playerMancalas[1]].numberOfStones;

    const min = m1 < m2 ? playerMancalas[0] : playerMancalas[1];

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
        let updatedStones = this.state.grid[next].numberOfStones + 1;
        let updatedHand = this.state.stonesInHand - 1;

        if (
          updatedHand === 0 &&
          updatedStones > 1 &&
          !this.state.grid[next].mancala
        ) {
          updatedHand = updatedStones;
          updatedStones = 0;
        }

        this.clearActive();
        this.updateCell({ active: true }, next);
        this.setState({ activeCell: next });

        if (
          this.state.grid[next].mancala &&
          this.state.grid[next].player !== this.state.playerTurn
        ) {
          this.setState({ popUp: true });
          clearInterval(intervalId);
        } else {
          this.updateCell({ numberOfStones: updatedStones }, next);
          this.setState({ stonesInHand: updatedHand });
        }

        if (
          updatedHand === 0 &&
          updatedStones === 1 &&
          !this.state.grid[next].mancala
        ) {
          this.endTurn();
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="info-container">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => this.playTurn(true)}
          >
            Clockwise
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => this.playTurn(false)}
          >
            Counter clockwise
          </Button>

          {this.state.popUp ? (
            <div className="pop-up">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.playTurn(this.state.isClockwise)}
              >
                skip
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.stealStones(0)}
              >
                Place 1 Stone & Pick 0
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.stealStones(1)}
              >
                Place 1 Stone & Pick 1
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.stealStones(2)}
              >
                Place 1 Stone & Pick 2
              </Button>
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
                  onClick={() => this.onClick(index)}
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
