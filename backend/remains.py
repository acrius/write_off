from datetime import date

from sqlalchemy import and_

from db import get_data_of_model, create_session
from models import Act, Remain, ActTable, Storage, Subdivision, DATABASES
from serializer import dumps

def get_calculated_remains(storage_id):
    remains = dumps(get_data_of_model(Remain, filters=Remain.storage == storage_id))
    acts = dumps(get_data_of_model(Act, filters=(and_(Act.storage == storage_id,
                                                       Act.is_active == True,
                                                       Act.is_upload == False))))
    acts = map(lambda act: act['id'], acts)
    acts_strings = dumps(get_data_of_model(ActTable, filters=ActTable.act.in_(acts)))
    return calculate_remains(remains, acts_strings)

def get_upgrade_date(storage_id):
    session = create_session(DATABASES['main'].metadata.bind)
    update_date = session.query(Subdivision.update_time)\
                         .filter(Subdivision.id == session.query(Storage.subdivision)\
                            .filter(Storage.id == storage_id).first()[0]).first()[0]
    return get_date_from_string(update_date)

def get_date_from_string(date_string):
    date_strings_list = date_string.split('.')
    return date(int('20' + date_strings_list[2]),
                int(date_strings_list[1]), int(date_strings_list[0]))

def calculate_remains(remains, acts):
    return list(filter(lambda remain: float(remain['amount']) != 0,
                       [{**remain, 'amount': str(round(float(remain['amount']) - sum([float(act['amount'])\
                        for act in acts if act['code'] == remain['code']]), 2))}\
                        for remain in remains]))
