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
    return seating_event


def create_group(event):
    group = GuestGroup()
    group.event = event
    db_session.add(group)
    return group


def create_guest(group, name, tags):
    guest = Guest()
    guest.group = group
    guest.name = name
    guest.tags = tags
    db_session.add(guest)
    return guest


def get_guest(guest_id):
    return db_session.query(Guest) \
        .filter(Guest.id == guest_id) \
        .first()


def get_tag_by_token(token):
    return db_session.query(Tag) \
        .filter(Tag.token == token) \
        .first()


def create_tag(text, token):
    tag = Tag()
    tag.text = text
    tag.token = token
    db_session.add(tag)
    return tag
