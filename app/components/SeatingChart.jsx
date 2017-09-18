import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

export default class SeatingChart extends Component {
  render () {
    const { chart, selected, onClick } = this.props;
    const { layout, score, options, favorited } = chart;

    return (
      <div
        onClick={onClick}
        className={cx(
          "chart",
          !!selected && "selected",
        )}
      >
        <div className="score">
          {Math.round(score * 1000)}
        </div>

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

                  !!spot.name && "person",
                )}
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
