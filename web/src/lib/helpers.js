
export function get_guest_count(groups) {
  return groups.reduce((guest_count, group) => {
    return guest_count + group.guests.length;
  }, 0);
}

export function get_seat_count(tables) {
  return tables.reduce((seat_count, table) => {
    return seat_count + table.number_of_seats;
  }, 0);
}
