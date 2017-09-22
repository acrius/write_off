'''
Utility module for working with database.
'''
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

def get_database(echo=False, **settings):
    '''
    Get :sqlalchemy: declarative base from settings.

    :param echo: Parameter for outputting :sqlalchemy: service messages.
    :param *settings: Settings for create :sqlalchemy: database engine, such as :URL: parametrs.
    '''
    return declarative_base(bind=create_engine(URL(**settings), echo=echo, encoding='utf8'))

def get_data_of_model(model, order_by=None, limit=None, filters=None, **connection):
    '''
    Get data for declarative model.

    :param model: :sqlalchemy: declarative model.
    :param filters: :sqlalchemy: filters parametrs.
    :param bind: :sqlalchemy: database engine.
    :param session: :sqlalchemy: session.
    '''
    session = connection.get('session') or\
                            create_session(connection.get('bind') or model.metadata.bind)
    query = session.query(model)
    if filters is not None:
        query = query.filter(filters)
    if order_by is not None:
        query = query.order_by(order_by)
    if limit is not None:
        query = query.limit(limit)
    return query.all()

def create_session(engine):
    '''
    Create :sqlalchemy: :session: from :sqlalchemy: database engine.

    :param engine: :sqlalchemy: database engine.
    '''
    return sessionmaker(bind=engine)()
