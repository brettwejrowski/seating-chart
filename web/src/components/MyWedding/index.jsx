import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { get_wedding } from 'lib/api';

import GuestList from 'components/GuestList/index.jsx';
import LayoutEditor from 'components/LayoutEditor/index.jsx';
import SeatingLayout from 'components/SeatingLayout/index.jsx';
import SeatingLineage from 'components/SeatingLineage/index.jsx';

import localStyles from './styles.scss';

export default class MyWedding extends Component {
  componentWillMount () {
    get_wedding((wedding) => {
      this.setState({ wedding });
    });
  }

  render () {
    if (!this.state) {
      return <div>Loading...</div>;
    }

    const { wedding } = this.state;

    return (
      <div>
        <h1>{ wedding.name }</h1>

        <LayoutEditor
          tables={wedding.tables}
        />
      </div>
    );
  }
}
