'''
Module contains database models.
'''

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from settings import DATABASES

class Subdivision(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of subdivisions of corporation.
    '''
    __tablename__ = 'subdivisions'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    code = Column(String(length=12))
    name = Column(String(length=125))
    update_time = Column(String(length=8))

class Storage(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of storages of subdivision.
    '''
    __tablename__ = 'storages'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    code = Column(String(length=12))
    name = Column(String(length=255))
    subdivision = Column(Integer, ForeignKey('subdivisions.id'))
    frp = Column(String(length=155))

class Remain(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of remains of storage.
    '''
    __tablename__ = 'remains'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    storage = Column(Integer, ForeignKey('storages.id'))
    account = Column(String(length=10))
    code = Column(String(length=15))
    name = Column(String(length=255))
    unit = Column(String(length=10))
    sum = Column(String(length=35))
    amount = Column(String(length=35))

class MainThing(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of main things of corporation.
    '''
    __tablename__ = 'the_main_things'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    code = Column(String(length=8))
    name = Column(String(length=255))
    subdivision = Column(Integer, ForeignKey('subdivisions.id'))

class Act(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of acts.
    '''
    __tablename__ = 'acts'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    date = Column(String(length=8))
    storage = Column(Integer, ForeignKey('storages.id'))
    receiver_storage = Column(Integer, ForeignKey('storages.id'))
    act_type = Column(Integer)
    is_active = Column(Boolean, default=False)
    is_upload = Column(Boolean, default=False)

class ActTable(DATABASES['main']): #pylint: disable=R0903
    '''
    Model of table of act.
    '''
    __tablename__ = 'tables_from_acts'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    act = Column(Integer, ForeignKey('acts.id'))
    code = Column(String(length=15))
    name = Column(String(length=255))
    account = Column(String(length=10))
    main_thing = Column(String(length=8))
    amount = Column(String(length=25))
    date_of_write_off = Column(String(length=8))

class OutAct(DATABASES['outside']): #pylint: disable=R0903
    '''
    Model of acts.
    '''
    __tablename__ = 'acts'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    date = Column(String(length=8))
    storage = Column(Integer)
    receiver_storage = Column(Integer)
    act_type = Column(Integer)

class OutActTable(DATABASES['outside']): #pylint: disable=R0903
    '''
    Model of table of act.
    '''
    __tablename__ = 'tables_from_acts'
    id = Column(Integer, primary_key=True) #pylint: disable=C0103
    act = Column(Integer, ForeignKey('acts.id'))
    code = Column(String(length=15))
    name = Column(String(length=255))
    account = Column(String(length=10))
    main_thing = Column(String(length=8))
    amount = Column(String(length=25))
    date_of_write_off = Column(String(length=8))
    act_relation = relationship('OutAct')