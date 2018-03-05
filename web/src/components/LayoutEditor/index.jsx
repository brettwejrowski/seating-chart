import React, { Component } from 'react';
import cx from 'classnames';

import Table from './Table.jsx';
import GridLines from './Gridlines.jsx';
import Palette from './Palette.jsx';

import * as controller from './controller';
import * as api from 'lib/api';
import { replaceAtIndex } from 'lib/helpers';

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
      tables,
    } = this.state;

    if (!active_table) {
      return;
    }

    const x = (e.clientX - drag_offset_x) / BLOCK_SIZE;
    const y = (e.clientY - drag_offset_y) / BLOCK_SIZE;
    const inTrash = e.clientY > (window.innerHeight - 50);
    const table_index = tables.indexOf(active_table);

    let new_tables = tables;

    if (event_type == 'resize') {
      new_tables = controller.resize(tables, table_index, { x, y });

    } else if (inTrash) {
      new_tables = controller.remove(tables, table_index);

    } else if (event_type == 'drag') {
      new_tables = controller.move(tables, table_index, { x, y });

    } else if (event_type == 'add') {
      new_tables = controller.create(tables, active_table, { x, y });
    }

    this.setState({
      active_table: null,
      tables: new_tables,
    });
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

    const showGridLines = !!changing_table && !changing_table.drop_to_delete;

    const chairValidator = (chair, offset) => {
      var layout = tables;

      if (active_table) {
        layout = replaceAtIndex(
          tables,
          tables.indexOf(active_table),
          changing_table,
        );
      }

      return controller.isSeatValid(layout, chair, offset);
    };

    return (
      <div
        className={localStyles.layout}
        onMouseUp={(e) => this.endEvent(e)}
        onMouseMove={(e) => this.dragMove(e)}
      >
        {!!showGridLines &&
          <GridLines
            block_size={BLOCK_SIZE}
            x={changing_table.x * BLOCK_SIZE}
            y={changing_table.y * BLOCK_SIZE}
            width={Math.round(changing_table.width)}
            height={Math.round(changing_table.height)}
          />
        }

        {tables.map((table) =>
          <Table
            seatValidator={chairValidator}
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
            startAdding={(e) => this.startAdding(table, e)}
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

        <Palette startAdding={this.startAdding.bind(this)} />

      </div>
    );
  }
}
