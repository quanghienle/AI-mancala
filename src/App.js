import React, { Component } from "react";
import Cell from "./components/Cell";
import Config from "./config";
import { Spinner } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import "./App.css";

class App extends Component {
  state = {
    grid: null,
    xMancalas: [2, 14],
    oMancalas: [8, 20],
    playerTurn: "x",
    stonesInHand: 0,
    popUp: false,
    activeCell: null
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
    this.setState({ playerTurn: nextPlayer, popUp: true });
  }

  playTurn(isClockwise) {
    if (this.state.stonesInHand !== 0) {
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
        this.updateCell({ active: true, numberOfStones: updatedStones }, next);

        this.setState({ stonesInHand: updatedHand, activeCell: next });

        if (
          updatedHand === 0 &&
          (updatedStones === 1 || this.state.grid[next].mancala)
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
          {this.state.popUp ? (
            <div className="pop-up">
              <Button variant="contained" color="primary">
                skip
              </Button>
              <Button variant="contained" color="primary">
                Pick 1
              </Button>
              <Button variant="contained" color="primary">
                Pick 2
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default App;
