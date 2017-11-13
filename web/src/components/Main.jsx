import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { get_wedding } from '../lib/api';

export default class MainApp extends Component {
  componentWillMount () {
    get_wedding(function (data) {
      console.log(data);
    });
  }

  render () {
    return (
      <div>
        <h1>My Wedding</h1>
      </div>
    );
  }
}
