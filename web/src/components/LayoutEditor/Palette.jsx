import React, { Component } from 'react';
import cx from 'classnames';

import Table from './Table.jsx';

import localStyles from './styles.scss';

export default class Palette extends Component {
  render () {
    const { startAdding } = this.props;

    return (
      <div className={localStyles.palette}>
        <div className={localStyles.plus}>
          +
        </div>

        <div className={localStyles.drawer}>
          <Table
            blockSize={13}
            x={3}
            y={2}
            width={2}
            height={4}
            type='rect'
            startDragging={(e) => startAdding({
              width: 2,
              height: 4,
              table_type: 'rect',
            }, e)}
          />

          <Table
            blockSize={13}
            x={10}
            y={3}
            width={4}
            height={2}
            type='rect'
            startDragging={(e) => startAdding({
              width: 3,
              height: 4,
              table_type: 'rect',
            }, e)}
          />

          <Table
            blockSize={13}
            x={19}
            y={2.5}
            width={3}
            height={3}
            type='circle'
            startDragging={(e) => startAdding({
              width: 3,
              height: 3,
              table_type: 'circle',
            }, e)}
          />
        </div>
      </div>
    );
  }
}
