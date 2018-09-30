'''
Module contains functions fot upload data to outside database.
'''
from datetime import datetime
from db import create_session
from models import DATABASES, Act, ActTable, OutAct, OutActTable, UploadLog


def upload(acts_ids, storage_id):
    '''
    Upload acts to outside database.

    :param acts_ids: List with id of acts for uplad.
    :param storage_id: Id of storage of act for upload.
    '''
    outer_object = []
    logs = []
    in_session = create_session(DATABASES['main'].metadata.bind)
    out_session = create_session(DATABASES['outside'].metadata.bind)
    out_session.query(UploadLog).filter(UploadLog.external_id.in_(acts_ids)).delete(synchronize_session=False)
    for act in in_session.query(Act).filter(Act.id.in_(acts_ids)):
        out_act = create_out_act(act)
        outer_object.append(out_act)
        outer_object.extend([create_out_act_string(string, out_act) \
                             for string in in_session.query(ActTable) \
                            .filter(ActTable.act == act.id)])
    for act_id in acts_ids:
        logs.append(UploadLog(external_id=act_id))
    out_session.add_all(outer_object)
    out_session.add_all(logs)
    out_session.commit()


def check_uploaded_acts(acts_ids):
    in_session = create_session(DATABASES['main'].metadata.bind)
    out_session = create_session(DATABASES['outside'].metadata.bind)
    uploaded_acts = out_session.query(UploadLog).filter(UploadLog.external_id.in_(acts_ids)).all()
    uploaded_acts_ids = [uploaded_act.external_id for uploaded_act in uploaded_acts]
    set_upload_for_acts(in_session, uploaded_acts_ids)

    return len(set(uploaded_acts_ids)) == len(set(acts_ids))


def set_upload_for_acts(session, acts_ids):
    '''
    Set is_upload field is True for acts.
    :param acts_ids: List with id of acts for uplad.
    '''
    session.add_all([set_upload_act(act) \
                     for act in session.query(Act) \
                    .filter(Act.id.in_(acts_ids))])
    session.commit()


def set_upload_act(act):
    '''
    Set is_upload state True for act.
    '''
    act.is_upload = True
    act.is_download = False
    act.download_date = None
    act.upload_date = datetime.now().date()
    return act


def create_out_act(inner_act):
    '''
    Create out act from inner act.
    '''
    return OutAct(date=inner_act.date, storage=inner_act.storage,
                  receiver_storage=inner_act.receiver_storage,
                  act_type=inner_act.act_type, in_id=inner_act.id, is_download=False)


def create_out_act_string(string, act):
    '''
    Create out string of out act from string of inner act.
    '''
    return OutActTable(act_relation=act, code=string.code,
                       name=string.name, account=string.account,
                       main_thing=string.main_thing, amount=string.amount)
