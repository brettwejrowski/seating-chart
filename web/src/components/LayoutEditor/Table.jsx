import React, { Component } from 'react';
import cx from 'classnames';

import localStyles from './styles.scss';

export default class Table extends Component {
  constructor (props) {
    super(props);

    this.state = {
      deleted_chairs: props.deletedChairs,
      editing_chairs: [],
    }
  }

  render () {
    const {
      type,
      blockSize,
      x, y,
      deletedChairs,
      className,
      startDragging,
      startResizing,
      dropToDelete,
      numberOfSeats,
    } = this.props;

    let { width, height } = this.props;

    if (type == 'circle') {
      width = Math.min(width, height);
      height = width;
    }

    const chairs = [];

    if (type == 'rect') {
      for (let x_iter = 1; x_iter <= width - 0.5; x_iter++) {
        chairs.push({
          x: x_iter - 0.5,
          y: height,
          rotate: '180deg',
          id: 'S' + x_iter,
        },{
          x: x_iter - 0.5,
          y: -1,
          rotate: '0',
          id: 'N' + x_iter,
        });
      }

      for (let y_iter = 1; y_iter <= height - 0.5; y_iter++) {
        chairs.push({
          y: y_iter - 0.5,
          x: width,
          rotate: '90deg',
          id: 'E' + y_iter,
        },{
          y: y_iter - 0.5,
          x: -1,
          rotate: '-90deg',
          id: 'W' + y_iter,
        });
      }
    } else if (type == 'circle') {
      let chair_count = numberOfSeats || Math.floor((Math.PI * Math.min(width, height)));
      let rads = (2 * Math.PI) / chair_count;

      for (let chair_iter = 0; chair_iter < chair_count; chair_iter++ ) {
        let rad = chair_iter * rads;

        chairs.push({
          x: (width / 2 + 0.5) * Math.cos(rad) + (width / 2) - 0.5,
          y: (width / 2 + 0.5) * Math.sin(rad) + (width / 2) - 0.5,
          rotate: `${rad + Math.PI / 2}rad`,
          id: `D${rad}`,
        })
      }

    }

    return (
      <div
        className={cx(
          localStyles[type],
          localStyles.wrapper,
          !!dropToDelete && 'drop-to-delete',
          className,
        )}
        style={{
          'left': `${blockSize * x}px`,
          'top': `${blockSize * y}px`,
          'width': `${blockSize * width}px`,
          'height': `${blockSize * height}px`,
        }}
      >
        <div
          className={localStyles.table}
          onMouseDown={startDragging}
          style={{
            'width': `${blockSize * width}px`,
            'height': `${blockSize * height}px`,
          }}
        />

        <div
          onMouseDown={startResizing}
          className={localStyles.resize}
          style={{
            'right': `-12px`,
            'bottom': `-12px`,
            'width': `28px`,
            'height': `28px`,
          }}
        />

        {chairs.map((chair) =>
          <div
            key={chair.id}
            className={localStyles.chair}
            style={{
              left: `${(chair.x + 0.25) * blockSize}px`,
              top: `${(chair.y + 0.25) * blockSize}px`,
              width: `${blockSize / 2}px`,
              height: `${blockSize / 2}px`,
              transform: `rotate(${chair.rotate})`,
            }}
          >
            <div className={localStyles.chairback} />
          </div>
        )}

        <div
          style={{
            'top': `-${blockSize + 20}px`,
            'left': `-${blockSize}px`,
          }}
          className={localStyles.count}>
          {chairs.length} seat{chairs.length !== 1 && 's'}
        </div>
      </div>
    );
  }

}
