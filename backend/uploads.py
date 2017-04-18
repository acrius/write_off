'''
Module contains functions fot upload data to outside database.
'''
from db import create_session
from models import DATABASES, Act, ActTable, OutAct, OutActTable

def upload(acts_ids, storage_id):
    '''
    Upload acts to outside database.

    :param acts_ids: List with id of acts for uplad.
    :param storage_id: Id of storage of act for upload.
    '''
    outer_object = []
    in_session = create_session(DATABASES['main'].metadata.bind)
    out_session = create_session(DATABASES['outside'].metadata.bind)
    out_session.query(OutAct).filter(OutAct.storage == storage_id).delete()
    for act in in_session.query(Act).filter(Act.id.in_(acts_ids)):
        out_act = create_out_act(act)
        outer_object.append(out_act)
        outer_object.extend([create_out_act_string(string, out_act)\
                             for string in in_session.query(ActTable)\
                                                     .filter(ActTable.act == act.id)])
    out_session.add_all(outer_object)
    out_session.commit()
    set_upload_for_acts(in_session, acts_ids)

def set_upload_for_acts(session, acts_ids):
    '''
    Set is_upload field is True for acts.
    :param acts_ids: List with id of acts for uplad.
    '''
    session.add_all([set_upload_act(act)\
                     for act in session.query(Act)\
                                       .filter(Act.id.in_(acts_ids))])
    session.commit()

def set_upload_act(act):
    '''
    Set is_upload state True for act.
    '''
    act.is_upload = True
    return act

def create_out_act(inner_act):
    '''
    Create out act from inner act.
    '''
    return OutAct(date=inner_act.date, storage=inner_act.storage,
                  receiver_storage=inner_act.receiver_storage, act_type=inner_act.act_type)

def create_out_act_string(string, act):
    '''
    Create out string of out act from string of inner act.
    '''
    return OutActTable(act_relation=act, code=string.code,
                       name=string.name, account=string.account,
                       main_thing=string.main_thing, amount=string.amount)
