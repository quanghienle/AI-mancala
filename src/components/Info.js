import React, { Component } from 'react';
import Config from '../config';

class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  displayInfo() {
    if (this.props.gameEnd) {
      let sum_x = 0;
      let sum_o = 0;
      this.props.grid.forEach(cell => {
        cell.player === "o" ? (sum_o += cell.numberOfStones) : (sum_x += cell.numberOfStones);
      });

      const player_x = Config.player["x"];
      const player_o = Config.player["o"];

      const winner = sum_x > sum_o ? player_x.name : player_o.name;

      return (
        <h3>
          {winner} wins !!
        </h3>
      );
    } else {
      return (
        <h3>
          Stones in hand: {this.props.stonesInHand} <br />
          {Config.player[this.props.playerTurn].name}
        </h3>
      );
    }
  }

  render() {
    return <div> {this.displayInfo()} </div>;
  }
}

export default Info;