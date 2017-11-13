from plinko.controller import (
    create_event,
    get_event_for_user,
)

from plinko.sql import db_context


def get_or_create_wedding_for_user(user_id):
    with db_context():
        wedding = get_event_for_user(user_id)
        print 'client'
        print wedding
        if not wedding:
            wedding = create_event(user_id, 'My Wedding')

        return wedding


