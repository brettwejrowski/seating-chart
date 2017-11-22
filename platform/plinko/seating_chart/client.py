import hashlib
import json
import random

from scipy import spatial


def _random_hash(obj):
    return hashlib.sha224(json.dumps(obj.to_dict())).hexdigest()


def _group_sort_lambda(sort_by):
    if sort_by == 'tag_count':
        return lambda group: sum([len(g.tags) for g in group.guests])
    elif sort_by == 'guest_count':
        return lambda group: len(group.guests)
    elif sort_by == 'id':
        return lambda group: group.id
    else:
        return lambda group: _random_hash(group)


def _guest_sort_lambda(sort_by):
    if sort_by == 'tag_count':
        return lambda guest: len(guest.tags)
    elif sort_by == 'guest_count':
        return lambda guest: guest.name.split(' ')[-1]
    elif sort_by == 'id':
        return lambda guest: guest.id
    else:
        return lambda guest: _random_hash(guest)



_guest_vectors = {}
def _get_vector_for_guest(tags, genome, guest):
    if guest.id in _guest_vectors:
        return _guest_vectors[guest.id]

    guest_vector = []
    for tag in tags:
        tag_vector = genome.get("tag_vector_{}".format(tag.token), 0)
        guest_vector.append(tag_vector if tag in guest.tags else 0)

    _guest_vectors[guest.id] = guest_vector
    return guest_vector


_guest_scores = {}
def _calculate_guest_similarity(tags, genome, guest_a, guest_b):
    if guest_a.id in _guest_scores:
        if guest_b.id in _guest_scores[guest_a.id]:
            return _guest_scores[guest_a.id][guest_b.id]
    else:
        _guest_scores[guest_a.id] = {}

    if guest_b.id in _guest_scores:
        if guest_a.id in _guest_scores[guest_b.id]:
            return _guest_scores[guest_b.id][guest_a.id]
    else:
        _guest_scores[guest_b.id] = {}

    guest_a_vector = _get_vector_for_guest(tags, genome, guest_a)
    guest_b_vector = _get_vector_for_guest(tags, genome, guest_b)

    score = 2 - spatial.distance.euclidean(
        guest_a_vector,
        guest_b_vector,
    )

    if guest_a.group == guest_b.group:
        score = score / genome['same_group_factor']

    _guest_scores[guest_a.id][guest_b.id] = score
    _guest_scores[guest_b.id][guest_a.id] = score

    return score


def _score_table_for_person(target_table, target_guest, layout, genome, tags, seated):
    score = 0

    for table in layout:
        distance = genome['distance_decay'] ** spatial.distance.euclidean(
            [table.x, table.y],
            [target_table.x, target_table.y],
        )

        for guest in seated[table.id]:
            score = score + (distance * _calculate_guest_similarity(
                tags,
                genome,
                target_guest,
                guest,
            ))

    return score



def create_seating_chart(guest_list, layout, genome, tags):
    group_index = genome['initial_group']
    guest_index = genome['initial_guest']
    any_seated = False

    seated = {}

    for table in layout:
        seated[table.id] = []

    groups = sorted(guest_list, key=_group_sort_lambda(genome['group_sort']))
    if genome['group_sort_direction'] == 'desc':
        groups.reverse()

    while len(groups) > 0:
        group = groups.pop(group_index % len(groups))
        group_index = group_index + genome['group_offset']

        guests = sorted(group.guests, key=_guest_sort_lambda(genome['group_sort']))
        if genome['guest_sort_direction'] == 'desc':
            guests.reverse()

        while len(guests) > 0:
            guest = guests.pop(guest_index % len(guests))
            guest_index = guest_index + genome['guest_offset']

            # seat first
            if not any_seated:
                best_table = layout[genome['initial_table'] % len(layout)]
            else:
                best_table = None
                scored_tables = sorted(layout, key=lambda table: _score_table_for_person(
                    table, guest, layout, genome, tags, seated))

                for table in scored_tables:
                    if table.number_of_seats > len(seated[table.id]):
                        best_table = table

            if best_table is not None:
                seated[best_table.id].append(guest)
            else:
                raise 'shite'

            any_seated = True

    return [{
        'seats': [g.to_dict() for g in seated[table.id]],
        'table': table.to_dict(),
    } for table in layout]




