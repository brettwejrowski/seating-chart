import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MyWedding from 'components/MyWedding/index.jsx';

import layout from 'styles/base.scss';

export default class MainApp extends Component {
  render () {
    return (
      <div>
        <MyWedding />
      </div>
    );
  }
}
