import React, { Component } from 'react';
import cx from 'classnames';

import * as api from 'lib/api';

import localStyles from './styles.scss';

const BLOCK_SIZE = 30;

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

    const x = (e.clientX - drag_offset_x) / BLOCK_SIZE;
    const y = (e.clientY - drag_offset_y) / BLOCK_SIZE;

    if (event_type == 'drag') {
      let tables = this.state.tables;

      if ((e.clientY) > (window.innerHeight - 50)) {
        tables.splice(tables.indexOf(active_table), 1);
        api.delete_table(active_table.id);
      } else {
        active_table.x = Math.round(x);
        active_table.y = Math.round(y);
      }

      this.setState({
        active_table: null,
        tables: tables,
      });
    } else if (event_type == 'add') {
      let tables = this.state.tables;

      if ((e.clientY) < (window.innerHeight - 50)) {
        active_table.x = Math.round(x);
        active_table.y = Math.round(y);
        active_table.id = `table${Math.random()}`;
        tables.push(active_table);
      }

      let payload = Object.assign({}, active_table);
      payload.number_of_seats = 0;
      delete payload['id'];

      api.create_table(payload, (data) => {
        active_table.id = data.id;
      });

      this.setState({
        active_table: null,
        tables: tables,
      });

    } else if (event_type == 'resize') {
      let width = Math.max(1, x - active_table.x + active_table.width);
      let height = Math.max(1, y - active_table.y + active_table.height);

      if (active_table.table_type == 'circle') {
        active_table.number_of_seats = Math.floor(Math.PI * Math.min(width, height));
        active_table.width = Math.round(Math.min(width, height));
        active_table.height = active_table.width;
      } else {
        active_table.width = Math.round(width)
        active_table.height = Math.round(height)
      }

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

  startAdding (table, e) {
    this.startEvent('add', {
      table_type: table.table_type || 'rect',
      width: table.width,
      height: table.height,
      x: (e.clientX / BLOCK_SIZE) - (table.width / 2),
      y: (e.clientY / BLOCK_SIZE) - (table.height / 2),
    }, e);
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
          'height': `${(height + PADDING * 2) * BLOCK_SIZE}px`,
          'borderRadius': `${6 * BLOCK_SIZE}px`,
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
            key={`${line.x}-${line.y}`}
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
            'borderRadius': `${6 * BLOCK_SIZE}px`,
          }}
        />
      </div>
    );
  }

  renderTrash (visible=false) {
    return (
      <div
        className={cx(
          localStyles.trash,
          !!visible && 'visible',
        )}
      >
        Drop Here to Delete
      </div>
    )
  }

  renderPalette () {
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
            startDragging={(e) => this.startAdding({
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
            startDragging={(e) => this.startAdding({
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
            startDragging={(e) => this.startAdding({
              width: 3,
              height: 3,
              table_type: 'circle',
            }, e)}
          />
        </div>
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
          table_type: active_table.table_type,
          x: active_table.x,
          y: active_table.y,
          width: Math.max(1, (mouse_x / BLOCK_SIZE) - active_table.x),
          height: Math.max(1, (mouse_y / BLOCK_SIZE) - active_table.y),
        };

      } else if (event_type == 'drag' || event_type == 'add') {
        changing_table = {
          table_type: active_table.table_type,
          x: (mouse_x - drag_offset_x) / BLOCK_SIZE,
          y: (mouse_y - drag_offset_y) / BLOCK_SIZE,
          width: active_table.width,
          height: active_table.height,
          drop_to_delete: (window.innerHeight - 50) < mouse_y,
        };
      }
    }

    const gridLines = !!changing_table && !changing_table.drop_to_delete ?
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
            type={table.table_type}
            numberOfSeats={table.number_of_seats}
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
            type={changing_table.table_type}
            numberOfSeats={changing_table.number_of_seats}
            dropToDelete={changing_table.drop_to_delete}
            width={changing_table.width}
            height={changing_table.height}
          />
        }

        {this.renderTrash(!!changing_table && (event_type === 'drag' || event_type === 'add'))}
        {this.renderPalette()}
      </div>
    );
  }
}


class Table extends Component {
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
      for (let x_iter = 1; x_iter < width - 0.5; x_iter++) {
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

      for (let y_iter = 1; y_iter < height - 0.5; y_iter++) {
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
