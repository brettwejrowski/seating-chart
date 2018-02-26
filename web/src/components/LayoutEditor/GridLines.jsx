import React, { Component } from 'react';
import cx from 'classnames';

import localStyles from './styles.scss';

const PADDING = 4;

export default class GridLines extends Component {
  render () {
    const { x, y, width, height, block_size } = this.props;

    const left = (Math.round(x / block_size) - PADDING) * block_size;
    const top = (Math.round(y / block_size) - PADDING) * block_size;

    let grid_lines = [];

    for (let i = 1; i < width + 2 * PADDING; i++) {
      grid_lines.push({
        height: height + 2 * PADDING,
        width: 0,
        x: i,
        y: 0,
      });
    }

    for (let j = 1; j < height + 2 * PADDING; j++) {
      grid_lines.push({
        height: 0,
        width: width + 2 * PADDING,
        x: 0,
        y: j
      });
    }

    return (
      <div
        className={localStyles.grid}
        style={{
          'left': `${left}px`,
          'top': `${top}px`,
          'width': `${(width + PADDING * 2) * block_size}px`,
          'height': `${(height + PADDING * 2) * block_size}px`,
          'borderRadius': `${6 * block_size}px`,
        }}
      >

        <div
          className={localStyles.next}
          style={{
            'left': `${(PADDING - 1) * block_size}px`,
            'top': `${(PADDING - 1) * block_size}px`,
            'width': `${(width + 2) * block_size}px`,
            'height': `${(height + 2) * block_size}px`
          }}
        />

        {grid_lines.map((line) =>
          <div
            key={`${line.x}-${line.y}`}
            className={localStyles.line}
            style={{
              left: `${line.x * block_size}px`,
              top: `${line.y * block_size}px`,
              width: `${line.width * block_size + 1}px`,
              height: `${line.height * block_size + 1}px`,
            }}
          />
        )}

        <div
          className={localStyles.overlay}
          style={{
            'borderRadius': `${6 * block_size}px`,
          }}
        />
      </div>
    );
  }
}
