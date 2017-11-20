import React, { Component } from 'react';

import * as api from 'lib/api';

export default class SeatingLayout extends Component {
  constructor (props) {
    super(props);

    this.state = { tables: props.tables };
  }

  createTable () {
    const { x, y, width, height } = this.state;
    const number_of_seats = width + height * 2;
    const table_type = 'rect';

    api.create_table({
      x, y,
      width, height,
      number_of_seats,
      table_type

    }, (data) => {
      const { tables } = this.state;
      tables.push(data);
      this.setState({ tables });
    });
  }

  deleteTable (id) {
    const tables = this.state.tables.filter((table) => {
      return table.id !== id;
    });

    this.setState({ tables });
    api.delete_table(id);
  }

  onTableInputChange (e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render () {
    const { tables } = this.state;

    return (
      <div>
        <ul>
          {tables.map((table) =>
            <li key={table.id}>
              <Table
                id={table.id}
                guests={table.guests}
                onDelete={() => this.deleteTable(table.id)}
              />
            </li>
          )}

          <li>
            <form
              action='javascript:;'
              onSubmit={() => this.addTable()}
              onChange={(e) => this.onTableInputChange(e)}
            >
              <input
                type='text'
                name='x'
                placeholder='x'
                value={this.state.x}
              />

              <input
                type='text'
                name='y'
                placeholder='y'
                value={this.state.y}
              />

              <input
                type='text'
                name='width'
                placeholder='width'
                value={this.state.width}
              />

              <input
                type='text'
                name='height'
                placeholder='height'
                value={this.state.height}
              />

              <a onClick={() => this.createTable()}>
                Save
              </a>
            </form>
          </li>
        </ul>
      </div>
    );
  }
}

class SeatingTable extends Component {
  render () {
    const { table, onDelete } = this.props;
    const { x, y, width, height, number_of_seats } = table;

    return (
      <div>
        {'<'}{x}, {y}{'>'}&nbsp;
        {width}x{height}&nbsp;
        {number_of_seats} seats

        <a onClick={onDelete}>
          Delete Table
        </a>
      </div>
    );
  }
}

