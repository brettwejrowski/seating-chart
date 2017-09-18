var similarity = require( 'compute-cosine-similarity' );
var _ = require('lodash');

var CHART_CODES = {
  seat: 's',
  table: 't',
  empty: ' ',
};

var GROUPS = [
  "bride_and_groom",
  "clark",
  "wejrowski",
  "jessa",
  "storenvy",
  "spur",
  "flinto",
  "mom",
  "dad",
  "sibling",
  "engineer",
].reduce((all, g, i) => {
  all[g] = i;
  return all;
}, {});

var dates = [
  {
    "Jessa Clark Wejrowski": [GROUPS.bride_and_groom, GROUPS.clark, GROUPS.storenvy, GROUPS.jessa, GROUPS.flinto],
    "Brett Clark Wejrowski": [GROUPS.bride_and_groom, GROUPS.wejrowski, GROUPS.spur, GROUPS.storenvy, GROUPS.engineer],
  },
  {
    "Ken Clark": [GROUPS.clark, GROUPS.dad],
  },
  {
    "Sandra  Clark": [GROUPS.clark, GROUPS.mom],
  },
  {
    "Katie Clark": [GROUPS.clark, GROUPS.sibling],
    "Connor Taylor": [GROUPS.clark, GROUPS.sibling],
  },
  {
    "Heather McDougall": [GROUPS.clark, GROUPS.sibling],
  },
  // {
  //   "Meagan  McDougall": [GROUPS.clark],
  // },
  {
    "Kay Wejrowski": [GROUPS.wejrowski, GROUPS.mom],
    "Gary  Wejrowski": [GROUPS.wejrowski, GROUPS.dad],
  },
  {
    "Jason Wejrowski": [GROUPS.wejrowski, GROUPS.sibling],
  },
  {
    "David Williams": [GROUPS.spur, GROUPS.wejrowski],
  },
  {
    "Alyssa  Zwingman": [GROUPS.spur],
    "Chris Calegari ": [GROUPS.spur],
  },
  {
    "Caryn Clough": [GROUPS.spur],
  },
  {
    "Courtney Landrus": [GROUPS.jessa, GROUPS.clark],
  },
  // {
  //   "Mallory Ibarra": [GROUPS.jessa],
  //   "Berto Ibarra Narcio": [GROUPS.jessa],
  // },
  {
    "Ash Huang": [GROUPS.jessa],
    "Lee Byron": [GROUPS.jessa, GROUPS.engineer],
  },
  {
    "Lynn Baxter": [GROUPS.storenvy],
    "Corey Reece": [GROUPS.storenvy, GROUPS.engineer],
  },
  {
    "Claire Smith": [GROUPS.storenvy],
    "James Smith": [GROUPS.storenvy, GROUPS.engineer],
  },
  {
    "Katherine Robinson": [GROUPS.jessa],
    "Tony Chang": [GROUPS.jessa, GROUPS.engineer],
  },
  {
    "Julie Lara": [GROUPS.spur],
    "Paul Lara": [GROUPS.spur],
  },
  {
    "Nathan Manousos": [GROUPS.flinto, GROUPS.engineer],
    "Donna Gih": [GROUPS.flinto],
  },
  {
    "Kazuho Okui": [GROUPS.flinto, GROUPS.engineer],
    "Liza": [GROUPS.flinto],
  },
  {
    "Sarah Young Glasgow": [GROUPS.jessa],
  },
];

var people = {};
dates.forEach((date, idx) => {
  Object.keys(date).forEach((name, invite_index) => {
    people[name] = {
      groups: date[name],
      invite: idx,
    };
  });
});


function get_seats_from_chart (input) {
  var seats = [];

  input.forEach((row, idy) => {
    row.forEach((spot, idx) => {
      if (spot === CHART_CODES.seat) {
        seats.push({ x: idx, y: idy });
      }
    });
  });

  return seats;
}

function get_score_for_pair (personA, personB, options) {
  var a = Array.apply(null, Array(Object.keys(GROUPS).length)).map(Number.prototype.valueOf,0);
  var b = Array.apply(null, Array(Object.keys(GROUPS).length)).map(Number.prototype.valueOf,0);
  personA.groups.forEach((group) => { a[group] = options.group_weights[group] });
  personB.groups.forEach((group) => { b[group] = options.group_weights[group] });


  var score = similarity(a, b);

  if (personA.invite !== personB.invite) {
    score = score * options.similarity_score;
  }

  return score;
}


function get_path (seatA, seatB) {
  var x = seatA.x, y = seatA.y;
  var target_x = seatB.x, target_y = seatB.y;
  var path = [];
  while (x !== target_x || y !== target_y) {
    var diff_x = x - target_x,
        diff_y = y - target_y;

    if (Math.abs(diff_x) >= Math.abs(diff_y)) {
      x = diff_x < 0 ? (x+1) : (x-1);
    } else {
      y = diff_y < 0 ? (y+1) : (y-1);
    }

    if (x !== target_x || y !== target_y) {
      path.push({ x: x, y: y, spot: chart[y][x]});
    }
  }

  return path;
}

function get_best_seat (chart, person, options) {
  var top_score = 0, best_seat = null;

  chart.forEach((row, idy) => {
    row.forEach((spot, idx) => {
      if (spot === CHART_CODES.seat) {
        var score = score_seat_for_person(idx, idy, person, chart, options);
        if (score >= top_score) {
          top_score = score;
          best_seat = { x: idx, y: idy};
        }
      }
    });
  });

  return best_seat;
}

function score_seat_for_person (x, y, person, chart, options) {
  var score = 0;
  var valid = true;
  chart.forEach((row, idy) => {
    row.forEach((spot, idx) => {
      if (!(idx === x && idy === y) && typeof spot !== 'string' && typeof spot !== 'number') {
        var person_score = get_score_for_pair(person, spot, options);
        var path = get_path({ x, y }, { x: idx, y: idy });

        if (spot.invite === person.invite && path.length > 1) {
          valid = false;
        }

        score += person_score / path.reduce((score, spot) => {
          if (spot === CHART_CODES.table) {
            return score += options.table_score;
          } else if (spot === CHART_CODES.space) {
            return score += options.space_score;
          } else if (spot === CHART_CODES.seat) {
            return score += options.seat_score;
          } else {
            return score += options.taken_seat_score;
          }
        }, 1);
      }
    })
  });

  return valid ? score : -1;
}

function get_score_for_chart (chart, options) {
  let score = 0;
  let valid = true;
  chart.forEach((row, idy) => {
    row.forEach((spot, idx) => {
      if (spot.name) {
        let s = score_seat_for_person(idx, idy, spot, chart, options);
        score += s;
        if (s === -1) {
          valid = false;
        }
      }
    });
  });



  return valid ? score : -1;
}

function get_next_person (seated, available, options) {
  if (seated.length === 0) {
    return available.shift();
  }

  let last_person = seated[seated.length-1],
      sorted_available = available.sort((a, b) => {
        let a_score = get_score_for_pair(last_person, a, options);
        let b_score = get_score_for_pair(last_person, b, options);

        if (a_score < b_score) return 1;
        if (a_score > b_score) return -1;
        if (a_score === b_score) return 0;
      });

  let next_person = sorted_available[0];
  available.splice(available.indexOf(next_person), 1);
  return next_person;
}

function create_seating_chart (chart_template, people, options) {
  var chart = _.cloneDeep(chart_template);

  var seats = get_seats_from_chart(chart),
      seat_index = options.initial_seat % seats.length,
      person_index = options.initial_person % Object.keys(people).length,

      available_people = Object.keys(people).map((name) => {
        return _.extend({
          name: name,
        }, people[name]);
      }),

      seated_people = [],
      next_person = null;

  var next_person = available_people.splice(person_index, 1)[0];
  chart[seats[seat_index].y][seats[seat_index].x] = next_person;
  seated_people.push(next_person);

  while (available_people.length) {
    next_person = get_next_person(seated_people, available_people, options);
    var seat = get_best_seat(chart, next_person, options);
    if (seat) {
      chart[seat.y][seat.x] = next_person;
      seated_people.push(next_person);
    }
  }

  return {
    layout: chart,
    seated_people: seated_people,
  };
}

function number_range (min, max) {
  return () => Math.random() * (max - min) + min;
}

function integer_range (min, max) {
  let generator = number_range(min, max);
  return () => Math.round(generator());
}

function list_of(length, generator) {
  return () => {
    let output = [];
    while (output.length < length) {
      output.push(generator());
    }

    return output;
  }
}

function one_of (options) {
  return () => options[integer_range(0, options.length - 1)()];
}

var chart = [
  "      s    s ",
  "sts  sts  sts",
  "sts  sts  sts",
  "sts  sts  sts",
  "sts  sts  sts",
  "     sts  sts",
  "     sts  sts",
].map((row) => row.split(""));

const option_template = {
  initial_seat: integer_range(0, get_seats_from_chart(chart).length),
  initial_person: integer_range(0, Object.keys(people).length),
  table_score: number_range(0, 1),
  space_score: number_range(0, 1),
  seat_score: number_range(0, 1),
  taken_seat_score: number_range(0, 1),
  similarity_score: number_range(0, 1),
  sort_by: one_of(['invite', 'first_group', 'num_groups', 'last_group', 'none']),
  group_weights: list_of(Object.keys(GROUPS).length, number_range(-1, 1))
};

function generate_options () {
  return Object.keys(option_template).reduce((output, option_name) => {
    output[option_name] = option_template[option_name]();
    return output;
  }, {});
}

function spawn (optionsA, optionsB) {
  return Object.keys(optionsA).reduce((output, option_name) => {
    let option_value = null;

    // handle lists
    if (Array.isArray(optionsA[option_name])) {
      option_value = option_template[option_name]().map((input, index) => {
        // mutationz
        if (Math.random() < 0.15) {
          return input;
        } else if (Math.random() < 0.5) {
          return optionsA[option_name][index];
        } else {
          return optionsB[option_name][index];
        }
      });

    // non lists
    } else if (Math.random() < 0.15) {
      option_value = option_template[option_name]();
    } else if (Math.random() > 0.5) {
      option_value = optionsA[option_name];
    } else {
      option_value = optionsB[option_name];
    }

    output[option_name] = option_value;
    return output;
  }, {});

  return new_options;
}

function mate (A, B) {
  var children = [], runs = 0;

  while (children.length < 8 && runs < 500) {
    let options = spawn(A, B),
        output = create_seating_chart(chart, people, options),
        score = get_score_for_chart(output.layout, options);

    let is_dup = children.find((child) => {
      return JSON.stringify(child.layout) === JSON.stringify(output.layout);
    });

    if (output.seated_people.length === Object.keys(people).length && !is_dup) {
      children.push({
        options: options,
        layout: output.layout,
        score: score
      });
    }

    runs++;
  }

  return children;
}

export default {
  people: people,
  init: () => mate(generate_options(), generate_options()),
  mate: mate,
}





