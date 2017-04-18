'''
Logic for server.
'''
from db import get_data_of_model, create_session
from models import Subdivision, Storage, Act, ActTable, MainThing, DATABASES
from serializer import dumps, loads
from synch_db import update_subdivisions_data, update_storages_data,\
                     update_remains_data, update_main_things_data
from remains import get_calculated_remains
from uploads import upload

def get_subdivisions():
    '''
    Get data of subdivisions.
    '''
    return dumps(get_data_of_model(Subdivision))

def get_storages_for_subdivision(subdivision_id):
    '''
    Get data of storages for subdivision.

    :param subdivision_id: ID of subdivision.
    '''
    return dumps(get_data_of_model(Storage, filters=Storage.subdivision == subdivision_id))

def get_remains_for_storage(storage_id):
    '''
    Get data of remains for storage.

    :param storage_id: ID of storage.
    '''
    return get_calculated_remains(storage_id)

def get_acts_for_storage(storage_id):
    '''
    Get data of acts for storage.

    :param storage_id: ID
    '''
    return dumps(get_data_of_model(Act, filters=Act.storage == storage_id))

def get_table_of_acts(act_id):
    '''
    Get data of table from act.

    :param act_id: ID of act.
    '''
    return dumps(get_data_of_model(ActTable, filters=ActTable.act == act_id))

def get_main_things():
    '''
    Get data of main things.
    '''
    return dumps(get_data_of_model(MainThing))

def save_act(act):
    '''
    Save information of act from python collections.

    :param act: Data of act.
    '''
    session = create_session(DATABASES['main'].metadata.bind)
    return loads(act, Act, session)

def save_act_table(act_table, act_id):
    '''
    Save table of act from python collections.

    :param act_table: Data of act table.
    '''
    if act_id:
        session = create_session(DATABASES['main'].metadata.bind)
        session.query(ActTable).filter(ActTable.act == act_id).delete()
        return loads(act_table, ActTable, session)

def update_subdivisions():
    '''
    View function gor update subdivisions.
    '''
    update_subdivisions_data()

def update_storages(subdivision_id):
    '''
    View function for update storages.

    :param subdivision_id: Id of subdivision of storages.
    '''
    update_storages_data(subdivision_id)

def update_remains(storage_id):
    '''
    View function for update remains.

    :param storage_id: Id of storages of remains.
    '''
    update_remains_data(storage_id)

def update_main_things():
    '''
    View function for update mains things.
    '''
    update_main_things_data()

def activate_act(act_id):
    '''
    Views function for activate act.
    :param act_id: Id of act.
    '''
    if act_id:
        session = create_session(DATABASES['main'].metadata.bind)
        act = session.query(Act).filter(Act.id == act_id).first()
        act.is_active = not act.is_active
        session.commit()

def upload_acts(acts_ids, storage_id):
    '''
    Views for upload acts.

    :param acts_ids: List of acts ids.
    '''
    if acts_ids:
        upload(acts_ids, storage_id)
