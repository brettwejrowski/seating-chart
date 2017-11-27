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
      active_table.width = x - active_table.x + active_table.width;
      active_table.height = y - active_table.y + active_table.height;
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
    const left = (Math.round(x / BLOCK_SIZE) - 2) * BLOCK_SIZE;
    const top = (Math.round(y / BLOCK_SIZE) - 2) * BLOCK_SIZE;

    let grid_lines = [];
    for (let i = 1; i < width + 4; i++) {
      grid_lines.push({
        height: height + 4,
        width: 0,
        x: i,
        y: 0,
      });
    }

    for (let j = 1; j < height + 4; j++) {
      grid_lines.push({
        height: 0,
        width: width + 4,
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
          'width': `${(width + 4) * BLOCK_SIZE}px`,
          'height': `${(height + 4) * BLOCK_SIZE}px`
        }}
      >

        <div
          className={localStyles.next}
          style={{
            'left': `${2 * BLOCK_SIZE}px`,
            'top': `${2 * BLOCK_SIZE}px`,
            'width': `${width * BLOCK_SIZE}px`,
            'height': `${height * BLOCK_SIZE}px`
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
          x: active_table.x * BLOCK_SIZE,
          y: active_table.y * BLOCK_SIZE,
          width: Math.max(1, (mouse_x / BLOCK_SIZE) - active_table.x),
          height: Math.max(1, (mouse_y / BLOCK_SIZE) - active_table.y),
        };

      } else if (event_type == 'drag') {
        changing_table = {
          x: mouse_x - drag_offset_x,
          y: mouse_y - drag_offset_y,
          width: active_table.width,
          height: active_table.height,
        };
      }
    }

    const gridLines = !!changing_table ?
      this.renderGridLines(
        changing_table.x,
        changing_table.y,
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
          <div
            key={table.id}
            className={cx(
              localStyles.wrapper,
              !!active_table && table.id === active_table.id && 'dragstart',
            )}
            style={{
              'left': `${BLOCK_SIZE * table.x}px`,
              'top': `${BLOCK_SIZE * table.y}px`,
              'width': `${BLOCK_SIZE * table.width}px`,
              'height': `${BLOCK_SIZE * table.height}px`,
            }}
          >
            <div
              className={localStyles.table}
              onMouseDown={(e) => this.startDragging(table, e)}
              style={{
                'width': `${BLOCK_SIZE * table.width}px`,
                'height': `${BLOCK_SIZE * table.height}px`,
              }}
            />

            <div
              onMouseDown={(e) => this.startResizing(table, e)}
              className={localStyles.resize}
              style={{
                'right': `-12px`,
                'bottom': `-12px`,
                'width': `28px`,
                'height': `28px`,
              }}
            />
          </div>
        )}

        {!!changing_table &&
          <div
            className={localStyles.wrapper}
            style={{
              'left': `${changing_table.x}px`,
              'top': `${changing_table.y}px`,
              'width': `${BLOCK_SIZE * changing_table.width}px`,
              'height': `${BLOCK_SIZE * changing_table.height}px`,
            }}
          >
            <div
              className={cx(
                localStyles.table,
                'active_table',
              )}
              style={{
                'width': `${BLOCK_SIZE * changing_table.width}px`,
                'height': `${BLOCK_SIZE * changing_table.height}px`,
              }}
            >
            </div>
          </div>
        }
      </div>
    );
  }
}
