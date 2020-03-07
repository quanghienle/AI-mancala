import React, { Component } from 'react';
import Button from "@material-ui/core/Button";

class SideBar extends Component {

  displayButtons() {
    if (this.props.humanPlayer && this.props.playerTurn === "x") {
      return (
        <div>
          <Button variant="contained" color="primary" onClick={() => this.props.playTurn(true)}>
            Clockwise
          </Button>
          <Button variant="contained" color="primary" onClick={() => this.props.playTurn(false)}>
            Counter-clockwise
          </Button>
        </div>
      );
    } else if (!this.props.humanPlayer && this.props.playerTurn === "x") {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.props.performTurn(this.props.playerTurn, 1)}
        >
          Perform Heuristic_1
        </Button>
      );
    }

    if (this.props.playerTurn === "o") {
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.props.performTurn(this.props.playerTurn, 2)}
        >
          Perform Heuristic_2
        </Button>
      );
    }
  }

  render() {
    return <div>{this.displayButtons()}</div>;
  }
}

export default SideBar;