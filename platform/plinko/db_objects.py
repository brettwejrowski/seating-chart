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
            'groups': [group.to_model() for group in self.groups],
            'tables': [table.to_model() for table in self.layout],
        }


class GuestGroup(DBObject):
    __tablename__ = 'guest_group'

    event_id = Column(Integer, ForeignKey('seating_event.id'))
    event = relationship("SeatingEvent", backref="groups")

    def to_model(self):
        return {
            'id': self.id,
            'guests': [guest.to_model() for guest in self.guests],
        }


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

    def to_model(self):
        return {
            'id': self.id,
            'name': self.name,
            'tags': [tag.to_model() for tag in self.tags],
        }


class Tag(DBObject):
    __tablename__ = 'tag'

    token = Column(String)
    text = Column(String)
    event_id = Column(String)

    def to_model(self):
        return {
            'id': self.id,
            'text': self.text,
            'token': self.token,
        }


# seating layout
class Table(DBObject):
    __tablename__ = 'seating_table'

    width = Column(Integer)
    height = Column(Integer)
    x = Column(Integer)
    y = Column(Integer)
    number_of_seats = Column(Integer)
    table_type = Column(String)
    event_id = Column(Integer, ForeignKey('seating_event.id'))
    event = relationship("SeatingEvent", backref="layout")

    def to_model(self):
        return {
            'id': self.id,
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'number_of_seats': self.number_of_seats,
            'table_type': self.table_type,
        }


