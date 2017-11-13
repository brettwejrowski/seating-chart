from datetime import datetime

from plinko.db_objects import (
    Guest,
    GuestGroup,
    SeatingEvent,
    Tag,
)

from plinko.sql import db_session


def get_event_for_user(user_id):
    return db_session.query(SeatingEvent) \
        .filter(SeatingEvent.owner_id == user_id) \
        .first()


def create_event(owner_id, name):
    seating_event = SeatingEvent()
    seating_event.created = datetime.utcnow()
    seating_event.owner_id = owner_id
    seating_event.name = name

    db_session.add(seating_event)
    print 'controller'
    print seating_event
    return seating_event
