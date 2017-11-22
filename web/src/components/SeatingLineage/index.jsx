import React, { Component } from 'react';

import * as api from 'lib/api';
import {
  get_position_for_seat,
  get_random_item,
  get_high_scored_index,
} from 'lib/helpers';

import localStyles from './styles.scss';

export default class SeatingLineage extends Component {
  componentWillMount () {
    api.create_lineage((data) => {
      this.setState({
        children: data,
        favorite: null,
        questions_asked: 0,
      });
    });
  }

  vote (child, milliseconds) {
    console.log(milliseconds);
    this.setState({
      questions_asked: this.state.questions_asked + 1,
    });
  }

  render () {
    if (!this.state) return <div>Loading...</div>;

    const { children } = this.state;

    let child = get_random_item(children);
    let table = get_random_item(child.seating_chart);
    let ms_asked = Date.now();

    return (
      <div>
        <SeatingChartPreview
          key={JSON.stringify(child.genome)}
          seating_chart={child.seating_chart}
          genome={child.genome}
          table={table}
        />

        <div className={localStyles.buttons}>
          <a onClick={() => this.vote(child, Date.now() - ms_asked)}>
            Nope
          </a>&nbsp;

          <a
            onClick={() => this.setState({
              favorite: child,
            )}
          >
            Yep
          </a>
        </div>
      </div>
    );
  }
}

const BLOCK_SIZE = 60;

class SeatingChartPreview extends Component {
  render () {
    const { table } = this.props;

    return (
      <Table
        table={table.table}
        seats={table.seats}
        offset={false}
        block_size={100}
      />
    );
  }
}


class Table extends Component {
  render () {
    const { table, seats, offset, block_size } = this.props;

    let container_styles = {
      'width': `${block_size * (table.width + 2)}px`,
      'height': `${block_size * (table.height  +2)}px`,
      'position': 'relative',
    };

    if (offset !== false) {
      container_styles.left = `${block_size * table.x}px`;
      container_styles.right = `${block_size * table.y}px`;
    }

    return (
      <div
        style={container_styles}
      >
        <div
          className={localStyles.table}
          style={{
            'left': `${block_size}px`,
            'top': `${block_size}px`,
            'width': `${block_size * table.width}px`,
            'height': `${block_size * table.height}px`,
          }}
        />

        {seats.map((guest, index) =>
          <Seat
            key={guest.id}
            block_size={block_size}
            coords={get_position_for_seat(
              index,
              table.width,
              table.height,
            )}
            guest={guest}
          />
        )}
      </div>
    );
  }
}


class Seat extends Component {
  render () {
    const { coords, guest, block_size } = this.props;

    return (
      <div
        className={localStyles.seat}
        style={{
          'left': `${block_size * coords[0]}px`,
          'top': `${block_size * coords[1]}px`,
          'width': `${block_size}px`,
          'height': `${block_size}px`,
        }}
      >
        {guest.name}
      </div>
    );
  }
}


class SeatingChart extends Component {
  render () {
    const { tables } = this.props;

    return (
      <div className={localStyles.container}>
        {tables.map((table) =>
          <div
            key={table.table.id}
            className={localStyles['table-container']}
            style={{
              'left': `${BLOCK_SIZE * table.table.x}px`,
              'top': `${BLOCK_SIZE * table.table.y}px`,
              'width': `${BLOCK_SIZE * (table.table.width + 2)}px`,
              'height': `${BLOCK_SIZE * (table.table.height  +2)}px`,
            }}
          >
            <div
              className={localStyles.table}
              style={{
                'left': `${BLOCK_SIZE}px`,
                'top': `${BLOCK_SIZE}px`,
                'width': `${BLOCK_SIZE * table.table.width}px`,
                'height': `${BLOCK_SIZE * table.table.height}px`,
              }}
            />

            {table.seats.map((guest, index) =>
              <Seat
                key={guest.id}
                block_size={BLOCK_SIZE}
                coords={get_position_for_seat(
                  index,
                  table.table.width,
                  table.table.height
                )}
                guest={guest}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

