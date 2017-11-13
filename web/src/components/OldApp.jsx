import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import chart from './../chart.js';

import SeatingChart from './SeatingChart.jsx';

export default class MainApp extends Component {
  constructor () {
    super();

    this.state = {
      generation: chart.init(),
      parents: [],
      options: [],
    };
  }

  selectChart (child, new_options) {
    if (this.state.parents.indexOf(child) !== -1) {
      return;
    }

    let { parents, options } = this.state;

    parents.push(child);
    options.push(new_options);
    if (parents.length > 2) {
      parents.shift();
    }
    if (options.length > 2) {
      options.shift();
    }
    this.setState({
      parents: parents,
      options: options,
    });
  }

  run () {
    if (this.state.parents.length === 2) {
      this.setState({
        generation: this.state.parents.concat(
          chart.mate(this.state.options[0], this.state.options[1])),
      });
    }
  }

  render () {
    return (
      <div>
        <a
          className="run-button"
          onClick={() => this.run()}
        >
          Run
        </a>
        {this.state.generation.map((child) => (
          <SeatingChart
            onSelect={(child, options) => this.selectChart(child, options)}
            key={JSON.stringify(child)}
            chart={child}
            selected={this.state.parents.indexOf(child) !== -1}
          />
        ))}
      </div>
    );
  }
}
