import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Config from "../config"
import "./PopUp.css"

class PopUp extends Component {
    
    render() {
        return (
          <div>
            {this.props.visible ? (
              <div className="pop-up">
                {Config.options
                  .filter(
                    op => op.take - op.put <= this.props.grid[this.props.activeCell].numberOfStones
                  )
                  .map((op, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      color="primary"
                      onClick={() => this.props.onClick(op)}
                    >
                      {op.label}
                    </Button>
                  ))}
              </div>
            ) : (
              <div className="pop-up" />
            )}
          </div>
        );
    }
}

export default PopUp;