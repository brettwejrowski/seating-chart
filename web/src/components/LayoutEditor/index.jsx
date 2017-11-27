import React, { Component } from 'react';
import cx from 'classnames';

import localStyles from './styles.scss';

const BLOCK_SIZE = 40;

export default class LayoutEditor extends Component {
  constructor (props) {
    super(props);

    this.state = {
      active_table: null,
      tables: props.tables,
    };
  }

  startEvent (type, table, e) {
    e.preventDefault();

    const { id, x, y } = table;

    const x_offset = e.clientX - x * BLOCK_SIZE;
    const y_offset = e.clientY - y * BLOCK_SIZE;

    this.setState({
      active_table: table,
      event_type: type,
      drag_offset_x: x_offset,
      drag_offset_y: y_offset,
      mouse_x: e.clientX,
      mouse_y: e.clientY,
    });
  }

  endEvent (e) {
    const {
      active_table,
      event_type,
      drag_offset_x,
      drag_offset_y,
    } = this.state;

    if (!active_table) {
      return;
    }

    const x = Math.round((e.clientX - drag_offset_x) / BLOCK_SIZE);
    const y = Math.round((e.clientY - drag_offset_y) / BLOCK_SIZE);

    if (event_type == 'drag') {
      active_table.x = x;
      active_table.y = y;
      this.setState({
        active_table: null,
        tables: this.state.tables,
      });
    } else if (event_type == 'resize') {
      active_table.width = Math.max(1, x - active_table.x + active_table.width);
      active_table.height = Math.max(1, y - active_table.y + active_table.height);
      this.setState({
        active_table: null,
        tables: this.state.tables,
      });
    }
  }

  startDragging (table, e) {
    this.startEvent('drag', table, e);
  }

  endDragging (e) {
    this.endEvent('drag', e);
  }

  startResizing (table, e) {
    this.startEvent('resize', table, e);
  }

  dragMove (e) {
    if (this.state.active_table) {
      this.setState({
        mouse_x: e.clientX,
        mouse_y: e.clientY,
      });
    }
  }

  renderGridLines (x, y, width, height) {
    const PADDING = 4;

    const left = (Math.round(x / BLOCK_SIZE) - PADDING) * BLOCK_SIZE;
    const top = (Math.round(y / BLOCK_SIZE) - PADDING) * BLOCK_SIZE;

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
          'width': `${(width + PADDING * 2) * BLOCK_SIZE}px`,
          'height': `${(height + PADDING * 2) * BLOCK_SIZE}px`
        }}
      >

        <div
          className={localStyles.next}
          style={{
            'left': `${(PADDING - 1) * BLOCK_SIZE}px`,
            'top': `${(PADDING - 1) * BLOCK_SIZE}px`,
            'width': `${(width + 2) * BLOCK_SIZE}px`,
            'height': `${(height + 2) * BLOCK_SIZE}px`
          }}
        />

        {grid_lines.map((line) =>
          <div
            className={localStyles.line}
            style={{
              left: `${line.x * BLOCK_SIZE}px`,
              top: `${line.y * BLOCK_SIZE}px`,
              width: `${line.width * BLOCK_SIZE + 1}px`,
              height: `${line.height * BLOCK_SIZE + 1}px`,
            }}
          />
        )}

        <div
          className={localStyles.overlay}
          style={{
            'border-radius': `${6 * BLOCK_SIZE}px`,
          }}
        />


      </div>
    );
  }

  render () {
    const {
      tables,
      active_table,
      event_type,
      mouse_x,
      mouse_y,
      drag_offset_x,
      drag_offset_y,
    } = this.state;


    let changing_table = null;

    if (active_table) {
      if (event_type == 'resize') {
        changing_table = {
          x: active_table.x,
          y: active_table.y,
          width: Math.max(1, (mouse_x / BLOCK_SIZE) - active_table.x),
          height: Math.max(1, (mouse_y / BLOCK_SIZE) - active_table.y),
        };

      } else if (event_type == 'drag') {
        changing_table = {
          x: (mouse_x - drag_offset_x) / BLOCK_SIZE,
          y: (mouse_y - drag_offset_y) / BLOCK_SIZE,
          width: active_table.width,
          height: active_table.height,
        };
      }
    }

    const gridLines = !!changing_table ?
      this.renderGridLines(
        changing_table.x * BLOCK_SIZE,
        changing_table.y * BLOCK_SIZE,
        Math.round(changing_table.width),
        Math.round(changing_table.height),
      ) : null;

    return (
      <div
        className={localStyles.layout}
        onMouseUp={(e) => this.endEvent(e)}
        onMouseMove={(e) => this.dragMove(e)}
      >
        {gridLines}

        {tables.map((table) =>
          <Table
            key={table.id}
            blockSize={BLOCK_SIZE}
            x={table.x}
            y={table.y}
            width={table.width}
            height={table.height}
            className={cx(
              !!active_table && table.id === active_table.id && 'dragstart',
            )}
            startDragging={(e) => this.startDragging(table, e)}
            startResizing={(e) => this.startResizing(table, e)}
          />
        )}

        {!!changing_table &&
          <Table
            blockSize={BLOCK_SIZE}
            className={event_type}
            x={changing_table.x}
            y={changing_table.y}
            width={changing_table.width}
            height={changing_table.height}
          />
        }
      </div>
    );
  }
}


class Table extends Component {
  render () {
    const {
      blockSize,
      x, y, width, height,
      className,
      startDragging,
      startResizing,
    } = this.props;


    const chairs = [];

    for (let x_iter = 1; x_iter < width - 0.5; x_iter++) {
      chairs.push({
        x: x_iter - 0.5,
        y: height,
        rotate: '180deg',
      },{
        x: x_iter - 0.5,
        y: -1,
        rotate: '0',
      });
    }

    for (let y_iter = 1; y_iter < height - 0.5; y_iter++) {
      chairs.push({
        y: y_iter - 0.5,
        x: width,
        rotate: '90deg',
      },{
        y: y_iter - 0.5,
        x: -1,
        rotate: '-90deg',
      });
    }

    return (
      <div
        className={cx(
          localStyles.wrapper,
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
      </div>
    );
  }

}
