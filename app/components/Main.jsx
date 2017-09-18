import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import chart from './../chart.js';

import SeatingChart from './SeatingChart.jsx';

class Main extends Component {
  constructor () {
    super();

    this.state = {
      generation: chart.init(),
      parents: [],
    };
  }

  selectChart (child) {
    if (this.state.parents.indexOf(child) !== -1) {
      return;
    }

    let parents = this.state.parents;
    parents.push(child);
    if (parents.length > 2) {
      parents.shift();
    }
    this.setState({ parents: parents });
  }

  run () {
    if (this.state.parents.length === 2) {
      this.setState({
        generation: this.state.parents.concat(
          chart.mate(this.state.parents[0].options, this.state.parents[1].options)),
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
            onClick={() => this.selectChart(child)}
            key={JSON.stringify(child)}
            chart={child}
            selected={this.state.parents.indexOf(child) !== -1}
          />
        ))}
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));


