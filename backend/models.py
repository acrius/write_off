'''
Module contains database models.
'''

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date, TIMESTAMP
from sqlalchemy.orm import relationship

from settings import DATABASES


class Storekeeper(DATABASES['main']):
    __tablename__ = 'storekeeper'
    id = Column(Integer, primary_key=True)
    name = Column(String(length=200))


class Subdivision(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of subdivisions of corporation.
    '''
    __tablename__ = 'subdivisions'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    code = Column(String(length=12))
    name = Column(String(length=125))
    update_time = Column(String(length=8))


class Storage(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of storages of subdivision.
    '''
    __tablename__ = 'storages'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    code = Column(String(length=12))
    name = Column(String(length=255))
    subdivision = Column(Integer, ForeignKey('subdivisions.id'))
    frp = Column(String(length=155))


class Remain(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of remains of storage.
    '''
    __tablename__ = 'remains'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    storage = Column(Integer, ForeignKey('storages.id'))
    account = Column(String(length=10))
    code = Column(String(length=15))
    name = Column(String(length=255))
    unit = Column(String(length=10))
    unitcode = Column(String(length=15))
    sum = Column(String(length=35))
    amount = Column(String(length=35))


class MainThing(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of main things of corporation.
    '''
    __tablename__ = 'the_main_things'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    code = Column(String(length=8))
    name = Column(String(length=255))
    subdivision = Column(Integer, ForeignKey('subdivisions.id'))


class Act(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of acts.
    '''
    __tablename__ = 'acts'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    parent_act = Column(Integer, ForeignKey('acts.id'))
    #    _parent = relationship('Act', remote_side=[id])
    date = Column(String(length=8))
    act_date = Column(Date())
    storage = Column(Integer, ForeignKey('storages.id'))
    receiver_storage = Column(Integer, ForeignKey('storages.id'))
    act_type = Column(Integer)
    storekeeper = Column(String(length=200))
    is_active = Column(Boolean, default=False)
    is_upload = Column(Boolean, default=False)
    upload_date = Column(Date())
    is_download = Column(Boolean, default=False)
    download_date = Column(String(length=8))
    subdivision = Column(Integer, ForeignKey('subdivisions.id'))


class ActTable(DATABASES['main']):  # pylint: disable=R0903
    '''
    Model of table of act.
    '''
    __tablename__ = 'tables_from_acts'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    act = Column(Integer, ForeignKey('acts.id'))
    code = Column(String(length=15))
    name = Column(String(length=255))
    account = Column(String(length=10))
    main_thing = Column(String(length=8))
    amount = Column(String(length=25))
    date_of_write_off = Column(String(length=8))
    time = Column(String(length=5))
    work_name = Column(String(length=200))
    unit = Column(String(10))
    unit_code = Column(String(15))
    act_relation = relationship('Act')


class Alembic(DATABASES['main']):
    __tablename__ = 'alembic_version'
    version_num = Column(String(length=32), primary_key=True)


class OutAct(DATABASES['outside']):  # pylint: disable=R0903
    '''
    Model of acts.
    '''
    __tablename__ = 'acts'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    date = Column(String(length=8))
    storage = Column(Integer)
    receiver_storage = Column(Integer)
    act_type = Column(Integer)
    in_id = Column(Integer)
    is_download = Column(Boolean, default=False)
    download_date = Column(String(length=8))


class OutActTable(DATABASES['outside']):  # pylint: disable=R0903
    '''
    Model of table of act.
    '''
    __tablename__ = 'tables_from_acts'
    id = Column(Integer, primary_key=True)  # pylint: disable=C0103
    act = Column(Integer, ForeignKey('acts.id'))
    code = Column(String(length=15))
    name = Column(String(length=255))
    account = Column(String(length=10))
    main_thing = Column(String(length=8))
    amount = Column(String(length=25))
    date_of_write_off = Column(String(length=8))
    act_relation = relationship('OutAct')


class UploadLog(DATABASES['outside']):
    '''
    Model of table of upload log.
    '''
    __tablename__ = 'upload_log'
    id = Column(Integer, primary_key=True)
    external_id = Column(Integer)
    date = Column(TIMESTAMP)
