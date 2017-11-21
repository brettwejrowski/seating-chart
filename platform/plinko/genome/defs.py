from plinko.genome.models import (
    IntegerMarker,
    NumberMarker,
    ChoiceMarker,
)

class TagMarker(NumberMarker):
    minimum = -1
    maximum = 1

class OffsetMarker(IntegerMarker):
    minimum = 0
    maximum = 10000

class SortDirectionMarker(ChoiceMarker):
    options = ['asc', 'desc']

class GroupSortMarker(ChoiceMarker):
    options = [
        'random',
        'guest_count',
        'tag_count',
        'id',
    ]

class GuestSortMarker(ChoiceMarker):
    options = [
        'random',
        'tag_count',
        'name',
        'id',
    ]

strategy_template = {
    'same_group_factor': NumberMarker,
    'distance_decay': NumberMarker,
    'same_table_factor': NumberMarker,
    'initial_group': OffsetMarker,
    'group_offset': OffsetMarker,
    'group_sort': GroupSortMarker,
    'group_sort_direction': SortDirectionMarker,
    'initial_guest': OffsetMarker,
    'guest_sort': GroupSortMarker,
    'guest_offset': OffsetMarker,
    'guest_sort_direction': SortDirectionMarker,
    'initial_table': OffsetMarker,
}
