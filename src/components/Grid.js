import React, { Component } from 'react';
import Cell from "./Cell";
import { Spinner } from "react-bootstrap";


class Grid extends Component {
    render() {
        return (
          <div>
            {this.props.grid === null ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              this.props.grid.map((cell, index) => {
                return (
                  <Cell
                    key={index}
                    cellState={cell}
                    onClick={() => {
                      this.props.onClick(index);
                    }}
                  />
                );
              })
            )}
          </div>
        );
    }
}

export default Grid;