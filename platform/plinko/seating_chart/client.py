import hashlib
import json
import random


def _random_hash(obj):
    return hashlib.sha224(json.dumps(obj)).hexdigest()


def _group_sort_lambda(sort_by):
    if sort_by == 'tag_count':
        return lambda group: sum([len(g['tags']) for g in group['guests']])
    elif sort_by == 'guest_count':
        return lambda group: len(group['guests'])
    elif sort_by == 'id':
        return lambda group: group['id']
    else:
        return lambda group: _random_hash(group)


def _guest_sort_lambda(sort_by):
    if sort_by == 'tag_count':
        return lambda guest: len(guest['tags'])
    elif sort_by == 'guest_count':
        return lambda guest: guest['name'].split(' ')[-1]
    elif sort_by == 'id':
        return lambda guest: guest['guests']
    else:
        return lambda guest: _random_hash(guest)


def _available_seats_at_table(table):
    return table['number_of_seats'] - len(table['seats'])


def calculate_guest_similarity(tags, genome, guest_a, guest_b):
    pass




def create_seating_chart(guest_list, layout, genome):
    group_index = genome['initial_group']
    guest_index = genome['initial_guest']

    for table in layout:
        table['seats'] = []

    groups = sorted(guest_list, key=_group_sort_lambda(genome['group_sort']))
    if genome['group_sort_direction'] == 'desc':
        groups.reverse()

    while len(groups) > 0:
        group = groups.pop(group_index % len(groups))
        group_index = group_index + genome['group_offset']

        guests = sorted(group['guests'], _guest_sort_lambda())
        if genome['guest_sort_direction'] == 'desc':
            guests.reverse()

        while len(guests) > 0:
            guest = guests.pop(guest_index % len(guests))
            guest_index = guest_index + genome['guest_offset']







