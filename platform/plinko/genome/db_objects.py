import json

from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey

from sqlalchemy import (
    Integer,
    String,
    Table,
)

from plink.genome.models import Genome
from plinko.sql import (
    Column,
    DBObject,
)

class GenomeDBObject(DBObject):
    __tablename__ = 'genome'

    parent_id = Column(Integer, ForeignKey('genome.id'))
    markers = Column(String)

    def to_model(self):
        markers = json.loads(self.markers)
        return Genome.from_dict(markers, self.parent_id)
