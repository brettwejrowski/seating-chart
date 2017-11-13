from sqlalchemy.orm import relationship
from sqlalchemy.schema import ForeignKey

from sqlalchemy import (
    Integer,
    String,
    Table,
)

from plinko.sql import (
    Column,
    DBObject,
)

class SeatingEvent(DBObject):
    __tablename__ = 'seating_event'

    name = Column(String)
    owner_id = Column(String)

    def to_model(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class GuestGroup(DBObject):
    __tablename__ = 'guest_group'

    event_id = Column(Integer, ForeignKey('seating_event.id'))
    event = relationship("SeatingEvent", backref="groups")


guest_tag_table = Table('guest_tag', DBObject.metadata,
    Column('guest_id', Integer, ForeignKey('guest.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

class Guest(DBObject):
    __tablename__ = 'guest'

    name = Column(String)
    tags = relationship("Tag", secondary=guest_tag_table)
    group_id = Column(Integer, ForeignKey('guest_group.id'))
    group = relationship("GuestGroup", backref="guests")


class Tag(DBObject):
    __tablename__ = 'tag'

    name = Column(String)
