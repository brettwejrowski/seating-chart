import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { modifySelf } from './../chart.js';

export default class SeatingChart extends Component {
  constructor (props) {
    super(props);

    this.state = {
      selected_square: null,
      layout: props.chart.layout,
      score: props.chart.score,
      pending: false,
      options: props.chart.options,
    };
  }

  morph () {
    const { layout, options } = this.state;

    this.setState({
      pending: false,
    });

    let attempts = modifySelf(layout, { options, layout });

    let update = () => {
      if (attempts.length === 0) {
        return;
      }

      let attempt = attempts.shift();
      if (attempt) {
        this.setState({
          layout: attempt.layout,
          options: attempt.options,
          score: attempt.score,
          pending: false,
        });
        setTimeout(update, 100);
      }
    }

    update();
  }

  handleSquareClick (idx, idy, spot) {
    if (!spot.name && spot !== "s") {
      return;
    }

    if (this.state.selected_square) {
      let layout = this.state.layout;
      let {x, y} = this.state.selected_square;
      layout[idy][idx] = this.state.selected_square.spot;
      layout[y][x] = spot;

      this.setState({
        layout: layout,
        selected_square: null,
        pending: true,
      });

    } else {
      this.setState({
        selected_square: {
          x: idx,
          y: idy,
          spot: spot,
        },
      });
    }
  }

  isSelected (idx, idy) {
    if (!this.state.selected_square) {
      return false;
    }

    let {x, y} = this.state.selected_square;
    return x === idx && y === idy;
  }

  render () {
    const { chart, selected, onSelect } = this.props;
    const { favorited } = chart;
    const { score, layout, pending, options } = this.state;

    return (
      <div
        onClick={() => onSelect(chart, options)}
        className={cx(
          "chart",
          !!selected && "selected",
        )}
      >
        <div className="score">
          {Math.round(score * 1000)}
        </div>

        {!!pending && (
          <div
            onClick={() => this.morph()}
            className="morph">
            Update
          </div>
        )}

        <div className="settings">
          <a
            className={cx(
              "favorite",
              !!favorited && "active",
            )}
          />
          <pre>
            {JSON.stringify(options, null, '\t')}
          </pre>
        </div>

        {layout.map((row, idy) => (
          <div className="row" key={idy}>
            {row.map((spot, idx) => (
              <div
                key={idx}
                className={cx(
                  'spot',
                  spot === "s" && "seat",
                  spot === " " && "space",
                  spot === "t" && "table",
                  this.isSelected(idx, idy) && "selected",
                  !!spot.name && "person",
                )}
                onClick={() => this.handleSquareClick(idx, idy, spot)}
              >
                {spot.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
