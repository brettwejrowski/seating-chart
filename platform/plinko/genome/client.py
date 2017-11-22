import random

from plinko.genome.defs import (
    strategy_template,
    TagMarker,
)
from plinko.genome.models import Genome


SIBLINGS_PER_GENERATION = 5

def generate_random_genome(tags=[]):
    markers = {}
    for tag in tags:
        marker_label = "tag_vector_{}".format(tag.token)
        markers[marker_label] = TagMarker

    for k, v in strategy_template.iteritems():
        markers[k] = v

    return Genome(markers)


def create_seed_generation(tags=[]):
    generation = []
    while len(generation) < SIBLINGS_PER_GENERATION:
        generation.append(generate_random_genome(tags))

    return generation


def mate(genome_a, genome_b):
    generation = []
    while len(generation) <= SIBLINGS_PER_GENERATION:
        child = genome_a.mate_with(genome_b)
        generation.append(child)

    return generation

