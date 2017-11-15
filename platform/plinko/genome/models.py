import random

from plinko.genome.exceptions import MismatchedMarkerType

MUTATION_RATE = 0.05

class Marker(object):
    value = None

    def mate_with(self, other):
        if isinstance(self, other.__class__):
            raise MismatchedMarkerType

        marker = other.__class__()
        if random.random() > MUTATION_RATE:
            marker.value = random.choice([self.value, other.value])
        return marker


class NumberMarker(Marker):
    minimum = 0
    maximum = 1

    def __init__(self):
        self.value = random.random() * self.maximum - self.minimum


class IntegerMarker(Marker):
    def __init__(self):
        self.value = int(round(random.random() * self.maximum - self.minimum))


class ChoiceMarker(Marker):
    options = []

    def __init__(self):
        self.value = random.choice(self.options)


class Genome(object):
    def __init__(self, markers):
        self.markers = {}
        for marker_name, marker_class in markers.iteritems():
            self.markers[marker_name] = marker_class()


    def mate_with(self, other):
        if len(self.markers) != len(other.markers):
            raise MismatchedMarkerType

        genome = self.__class__({})

        for k, v in self.iteritems():
            genome.markers[k] = self.markers[k].mate_with(other.markers[k])

    def to_dict(self):
        _output = dict()
        for k, v in self.markers.iteritems():
            _output[k] = v.value

        return _output


