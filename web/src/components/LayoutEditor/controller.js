var SAT = require('sat');
import { clone, extend } from 'lodash';
import { replaceAtIndex } from 'lib/helpers';


export function resize (layout, index, coords) {
  const { x, y } = coords;

  let table = clone(layout[index]),
      width = Math.max(1, x - table.x + table.width),
      height = Math.max(1, y - table.y + table.height);

  if (table.table_type == 'circle') {
    table.number_of_seats = Math.floor(Math.PI * Math.min(width, height));
    table.width = Math.round(Math.min(width, height));
    table.height = table.width;
  } else {
    table.width = Math.round(width);
    table.height = Math.round(height);
  }

  layout[index] = table;

  return replaceAtIndex(layout, index, table);
}

export function create (layout, input, coords) {
  const { x, y } = coords;
  const table = extend(clone(input), {
    x: Math.round(x),
    y: Math.round(y),
    id: `table${Math.random()}`,
  });

  layout.push(table);

  return layout;
}

export function remove (layout, index) {
  return layout.filter((t, i) => i !== index);
}

export function move (layout, index, coords) {
  const { x, y } = coords;
  const table = extend(clone(layout[index]), {
    x: Math.round(x),
    y: Math.round(y),
  });

  return replaceAtIndex(layout, index, table);
}

export function isSeatValid (layout, seat, offset) {
  return layout.filter((table) => {
    let collided = false,
        seat_vector = new SAT.Vector(
          offset.x + seat.x + 0.25,
          offset.y + seat.y + 0.25,
        ),
        seat_polygon = new SAT.Circle(seat_vector, 0.4);

    if (table.table_type == "rect") {
      var table_vector = new SAT.Vector(table.x, table.y),
          table_polygon = new SAT.Box(
            table_vector,
            table.width,
            table.height,
          ).toPolygon();

      collided = SAT.testPolygonCircle(table_polygon, seat_polygon);
    } else if (table.table_type == "circle") {
      var radius = table.width / 2,
          table_vector = new SAT.Vector(table.x + radius, table.y + radius),
          table_circle = new SAT.Circle(table_vector, radius);

      collided = SAT.testCircleCircle(seat_polygon, table_circle);
    }

    return collided;
  }).length > 0;
}
