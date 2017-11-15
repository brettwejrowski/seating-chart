import json
from functools import partial

from sqlalchemy import (
    Column,
    create_engine,
    DateTime,
    event,
    Integer,
    String,
    Table,
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import (
    Executable,
    ClauseElement,
)

from plinko.config import (
  DATABASE_SCHEMA,
  DATABASE_NAME,
)


def make_read_only(session):
    # pylint: disable=unused-variable
    @event.listens_for(session, 'before_flush')
    def before_flush(session, flush_context, instances):
        # pylint: disable=unused-argument
        raise RuntimeError("Write attempt in a read only session")


def get_engine_url():
    if DATABASE_SCHEMA == 'postgresql':
        return "{schema}://{user}:{password}@{host}:{port}/{db}".format(
            schema=service.database.schema,
            user=service.database.username,
            password=service.database.password,
            host=service.database.host,
            port=service.database.port,
            db=service.database.db,
        )

    elif DATABASE_SCHEMA == 'sqlite':
        return "{schema}:///{db}".format(
            schema=DATABASE_SCHEMA,
            db=DATABASE_NAME,
        )

    else:
        raise Exception("Invalid Database schema: {}".format(DATABASE_SCHEMA))


def make_engine(echo):
    return create_engine(get_engine_url(), echo=echo)


def make_session(echo=False, autoflush=True, readonly=True):
    engine = make_engine(echo=echo)
    session_cls = sessionmaker(bind=engine)
    session = session_cls(autoflush=autoflush)

    if readonly:
        make_read_only(session)
    return session

db_session = make_session(readonly=False)

# pylint: disable=invalid-name, no-self-argument,
class db_context(object):
    def __init__(cls):
        pass

    def __enter__(cls):
        return db_session

    def __exit__(cls, e_type, e_value, traceback):
        # pylint: disable=bare-except
        if e_type is None:
            try:
                db_session.commit()
            except e:
                db_session.rollback()
                raise e


Column = partial(Column, nullable=False)

class DefaultMixin(object):
    """Common columns and naming convention for all my db objects"""

    def to_dict(self):
        _dict = {}
        print self.__dict__
        for k, v in self.__dict__.iteritems():
            if not k.startswith("_sa"):
                try:
                    _dict[k] = v.to_dict()
                except (AttributeError, ValueError):
                    _dict[k] = v




    id = Column(Integer, primary_key=True, autoincrement=True, nullable=False) # pylint: disable=invalid-name
    created = Column(DateTime, nullable=False)


DBObject = declarative_base(cls=DefaultMixin)
