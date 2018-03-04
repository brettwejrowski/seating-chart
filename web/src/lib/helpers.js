
export function get_guest_count (groups) {
  return groups.reduce((guest_count, group) => {
    return guest_count + group.guests.length;
  }, 0);
}

export function get_seat_count (tables) {
  return tables.reduce((seat_count, table) => {
    return seat_count + table.number_of_seats;
  }, 0);
}


export function get_position_for_seat (seat_number, width, height) {
  if (seat_number >= 2 * (width + height)) {
    return null;
  }

  if (seat_number < width) {
    return [seat_number + 1, 0];

  } else if (seat_number < width + height) {
    return [width + 1, (seat_number + 1) - height];

  } else if (seat_number < (2 * width) + height) {
    return [(width * 2 + height) - seat_number, height + 1];

  } else {
    return [0, (2 * (width + height)) - seat_number];
  }
}

export function get_random_item (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


export function get_high_scored_index (feedback) {
  let scores = {};

  feedback.forEach((vote) => {
    let index = vote[0];
    let score = vote[1];

    if (!scores[index]) {
      scores[index] = 0;
    }

    scores[index] += score;
  });

  let max = -Infinity;
  let i = null;
  Object.keys(scores).forEach((index) => {
    if (scores[index] > max) {
      max = scores[index];
      i = index;
    }
  })

  return i;
}

export function replaceAtIndex (arr, index, element) {
  return arr.map((e, i) => i === index ? element : e);
}

