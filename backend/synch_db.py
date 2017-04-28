'''
Module contens class and functions for synchronization
internal databases and external database.
'''
from db import create_session, get_data_of_model
from models import Subdivision, Storage, Remain, MainThing, DATABASES

class SynchDB:
    '''
    Class for updating data of internal :sqlalchemy: database models
    from data from similar :sqlalchemy: models of external database.

    :param in_engine: :sqlalchemy: database engine for internal database.
    :param out_engine: :sqlalchemy: database engine for external database.
    '''
    def __init__(self, in_engine, out_engine):
        if in_engine and out_engine:
            self.out_session = create_session(DATABASES['outside'].metadata.bind)
            self.in_session = create_session(DATABASES['main'].metadata.bind)

            self._clear_objects_buffer()
        else:
            raise AttributeError

    def _clear_objects_buffer(self):
        self.update_objects = []
        self.append_objects = []

    def update_data_for_models(self, *models, **query):
        '''
        Update data for models.
        :param *models: :sqlalchemy: models.
        :param filters: :sqlalchemy: filters for queryies.
        '''
        for model in models:
            self._update_data_for_model(model, query.get('filters') or {})

    def _update_data_for_model(self, model, filters):
        for out_value in get_data_of_model(model, filters=filters.get(model.__tablename__),
                                           session=self.out_session):
            self._update_value(out_value, model)

    def _update_value(self, out_value, model):
        results = self.in_session.query(model).filter(model.id == out_value.id)
        if results.count():
            in_value = results.first()
            for key in out_value.__dict__.keys():
                if not key.startswith('_'):
                    setattr(in_value, key, getattr(out_value, key))
            self.update_objects.append(in_value)
        else:
            self._append_value(out_value, model)

    def replace_data_for_models(self, *models, **query):
        '''
        Replace data for models.
        :param *models: :sqlalchemy: models.
        :param filters: :sqlalchemy: filters for queryies.
        '''
        for model in models:
            self._replace_data_for_model(model, query.get('filters') or {})

    def _replace_data_for_model(self, model, filters):
        self._delete_data_from_model(model, filters)
        self._append_data_for_model(model, filters)

    def _delete_data_from_model(self, model, filters):
        query = self.in_session.query(model)
        _filter = filters.get(model.__tablename__)
        if _filter is not None:
            query = query.filter(_filter)
        query.delete()

    def _append_data_for_model(self, model, filters):
        for out_value in get_data_of_model(model, filters=filters.get(model.__tablename__),
                                           session=self.out_session):
            self._append_value(out_value, model)

    def _append_value(self, out_value, model):
        self.append_objects.append(
            model(**{key: value for key, value in out_value.__dict__.items()\
                                if not key.startswith('_')}))

    def commit(self):
        '''
        Commit results of synchronization to internal database.
        '''
        self.in_session.add_all(self.append_objects)
        self.in_session.commit()
        self._clear_objects_buffer()

MAIN_ENGINE = DATABASES['main'].metadata.bind
OTSIDE_ENGINE = DATABASES['outside'].metadata.bind

def update_subdivisions_data():
    '''
    Update subdivisions data.
    '''
    update_data(update_data_models=[Subdivision,])

def update_storages_data():
    '''
    Update storages data foe subdivision.

    :param subdivision_id: ID of subdivision for update data of storages.
    '''
    update_data(update_data_models=[Storage, ])

def update_remains_data(storage_id):
    '''
    Update remains for storage.

    :param storage_id: ID of storage for remains.
    '''
    update_data(replace_data_models=[Remain,],
                filters={Remain.__tablename__: Remain.storage == storage_id})

def update_main_things_data():
    '''
    Update mains things data.
    '''
    update_data(replace_data_models=[MainThing,])

def update_data(update_data_models=None, replace_data_models=None, filters=None):
    '''
    Update data in internal database from data in external database,

    :param update_data_models: List with :sqlalchemy: declarative models to update data.
    :param replace_data_models: List with :sqlalchemy: declarative models to replace data.
    :param filters: Dictionary with {__tablename__: :sqlalchemy: filter parametrs}
    '''
    synch = SynchDB(MAIN_ENGINE, OTSIDE_ENGINE)
    if update_data_models:
        synch.update_data_for_models(*update_data_models, filters=filters)
    if replace_data_models:
        synch.replace_data_for_models(*replace_data_models, filters=filters)
    synch.commit()
