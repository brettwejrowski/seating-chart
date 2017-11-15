import random

from plinko.genome.defs import (
    strategy_template,
    TagMarker,
)
from plinko.genome.models import Genome


def generate_random_genome(tags=[]):
    markers = {}
    for tag in tags:
        marker_label = "tag_weight_{}".format(tag.token)
        markers[marker_label] = TagMarker

    for k, v in strategy_template.iteritems():
        markers[k] = v

    return Genome(markers)





