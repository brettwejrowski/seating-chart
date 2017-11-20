import re

from plinko import controller
from plinko.exceptions import (
    EventNotFound,
    GroupNotFound,
    GuestNotFound,
    TagNotFound,
)
from plinko.sql import db_context


def _tokenize_tag(text):
    return re.sub(r"[^a-z0-9_]+", "_", text.lower())


def get_or_create_wedding_for_user(user_id):
    with db_context():
        wedding = controller.get_event_for_user(user_id)
        if wedding is None:
            wedding = controller.create_event(user_id, 'My Wedding')
        return wedding


def create_group(user_id, guests):
    with db_context():
        event = get_or_create_wedding_for_user(user_id)
        if event is None:
            raise EventNotFound
        group = controller.create_group(event)
        for guest in guests:
            tags = [controller.create_tag(
                event,
                tag_text,
                _tokenize_tag(tag_text),
            ) for tag_text in guest['tags']]

            controller.create_guest(group, guest['name'], tags)
    return group

def delete_group(group_id):
    with db_context() as db_session:
        group = controller.get_group(group_id)
        if group is None:
            raise GroupNotFound

        for guest in group.guests:
            db_session.delete(guest)

        db_session.delete(group)



def create_guest_for_group(group_id, name, tags=[]):
    with db_context():
        group = controller.get_group(group_id)
        if group is None:
            raise GroupNotFound
        return controller.create_guest(group, name, tags)


def remove_guest(guest_id):
    with db_context() as db_txn:
        guest = controller.get_guest(guest_id)
        if guest is None:
            raise GuestNotFound
        db_txn.delete(guest)


def add_tag_for_guest(guest_id, text):
    with db_context():
        guest = controller.get_guest(guest_id)
        if guest is None:
            raise GuestNotFound
        token = _tokenize_tag(text)
        tag = controller.get_tag_by_token(token)
        if tag is None:
            tag = controller.create_tag(guest.group.event, text, token)

        guest.tags.append(tag)
        return guest


def remove_tag_from_guest(guest_id, tag_id):
    with db_context():
        guest = controller.get_guest(guest_id)
        if guest is None:
            raise GuestNotFound

        tag = controller.get_tag(tag_id)
        if tag is None:
            raise TagNotFound

        guest.tags.remove(tag)
        return guest


def get_tags_for_wedding(user_id):
    with db_context():
        wedding = get_or_create_wedding_for_user(user_id)
        return controller.get_tags_for_event(wedding)


def create_table(
        user_id,
        x,
        y,
        width,
        height,
        table_type,
        number_of_seats,
):
    with db_context():
        event = get_or_create_wedding_for_user(user_id)
        table = controller.create_table(
            event,
            x,
            y,
            width,
            height,
            table_type,
            number_of_seats,
        )
        return table


def delete_table(table_id):
    with db_context() as db_txn:
        table = controller.get_table(table_id)
        if table is None:
            raise TableNotFound

        db_txn.delete(table)




