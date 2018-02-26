import { clone, extend } from 'lodash';


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

function replaceAtIndex (arr, index, element) {
  return arr.map((e, i) => i === index ? element : e);
}

