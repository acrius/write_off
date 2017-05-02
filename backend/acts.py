from sqlalchemy import and_

from db import get_data_of_model, create_session
from serializer import dumps

from models import Act, ActTable, DATABASES

def _get_act_ids(acts):
    return list(map(lambda act: act.id, acts))

def _get_active_acts(subdivision_id):
    return get_data_of_model(Act, filters=(and_(Act.subdivision == subdivision_id,
                                                Act.is_active == True,
                                                Act.is_upload == False,
                                                Act.act_type == 1)))

def _get_act_from_act_list(act, new_acts):
    new_act = list(filter(lambda nact: nact.storage == act['receiver_storage'], new_acts))
    return new_act[0] if new_act else False

def _create_new_act(act):
    return Act(**{key: value for key, value in act.items()\
                         if key != 'storage' and key != 'receiver_storage'\
                         and key != 'act_type' and key != 'id'},
               storage=act['receiver_storage'], receiver_storage=None, act_type=0)

def _get_act_rows(act, act_rows):
    return list(filter(lambda row: row['act'] == act['id'], act_rows))

def _get_new_row(act_row):
    return {key: value for key, value in act_row.items() if key != 'id' and key != 'dateWriteOff'}

def genereate_acts(subdivision_id):
    '''
    From active acts with type is 1 generate acts with type 0.
    '''
    new_acts = []
    new_acts_rows = []
    acts = _get_active_acts(subdivision_id)
    session = create_session(DATABASES['main'].metadata.bind)
    act_rows = dumps(get_data_of_model(ActTable, filters=ActTable.act.in_(_get_act_ids(acts))))
    for act in  dumps(acts):
        new_act = _get_act_from_act_list(act, new_acts)
        if not new_act:
            new_act = _create_new_act(act)
            new_acts.append(new_act)
        for act_row in _get_act_rows(act, act_rows):
            new_row = ActTable(act_relation=new_act, dateWriteOff=act['date'],
                               **_get_new_row(act_row))
            new_acts_rows.append(new_row)
    session.add_all(new_acts)
    session.add_all(new_acts_rows)
    session.commit()
