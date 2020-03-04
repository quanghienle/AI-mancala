import React, { Component } from "react";
import Config from "../config";
import "./Cell.css";

class Cell extends Component {
  constructor(props) {
    super(props);

    const xy = this.props.cellState.xy;

    const width =
      xy[1] === 0 || xy[1] === 7 ? Config.cellHeight * 2 : Config.cellHeight;
    const height =
      xy[0] === 0 || xy[0] === 7 ? Config.cellHeight * 2 : Config.cellHeight;

    this.state = {
      width: width,
      height: height,
      x: xy[0],
      y: xy[1],
    };
  }

  render() {
    const cellColor = Config.player[this.props.cellState.player];
    const border = this.props.cellState.active ? Config.activeColor : cellColor.border;
    return (
      <div
        className="button-container"
        style={{
          left: `${this.state.x * Config.cellHeight}px`,
          top: `${this.state.y * Config.cellHeight}px`,
          height: this.state.height,
          width: this.state.width,
        }}
      >
        <button
          className="cell-button"
          style={{
            backgroundColor: cellColor.background,
            borderColor: border,
          }}
          onClick={this.props.onClick}
        >
          {this.props.cellState.numberOfStones}
        </button>
      </div>
    );
  }
}

export default Cell;
