from sqlalchemy import and_

from db import get_data_of_model, create_session
from serializer import dumps

from models import Act, ActTable, DATABASES

def genereate_acts(subdivision_id):

    new_acts = []
    new_acts_rows = []
    acts = get_data_of_model(Act, filters=(and_(Act.subdivision == subdivision_id,
                                                Act.is_active == True,
                                                Act.is_upload == False,
                                                Act.act_type == 1)))
    acts_ids = list(map(lambda act: act.id, acts))
    acts_dumps = dumps(acts)
    # parents = set(filter(lambda act: act is not None, map(lambda act: act.parent_act, acts)))
    session = create_session(DATABASES['main'].metadata.bind)
    # if parents:
    #     session.query(ActTable).filter(ActTable.act.in_(parents)).delete()
    #     session.query(Act).filter(Act.id.in_(parents)).delete()
    acts_rows = dumps(get_data_of_model(ActTable, filters=ActTable.act.in_(acts_ids)))
    for act in acts_dumps:
        # act_id = act['id']
        new_act = list(filter(lambda nact: nact.storage == act['receiver_storage'], new_acts))
        if new_act:
            new_act = new_act[0]
        else:
            new_act = Act(**{key: value for key, value in act.items()\
                             if key != 'storage' and key != 'receiver_storage'\
                             and key != 'act_type' and key != 'id'},
                             storage=act['receiver_storage'],
                             receiver_storage=None, act_type = 0)
            new_acts.append(new_act)
        for act_row in list(filter(lambda row: row['act'] == act['id'], acts_rows)):
            new_act_row = {key: value for key, value in act_row.items() if key != act}
            new_row = ActTable(act_relation=new_act,
                               dateWriteOff=act['date'],
                               **{key: value for key, value in act_row.items() if key != 'id' and key != 'dateWriteOff'})
            new_acts_rows.append(new_row)
        # move_act = session.query(Act).filter(Act.id == act['id']).first()
        # print(move_act._parent)
        # move_act._parent = new_act
    session.add_all(new_acts)
    session.add_all(new_acts_rows)
    session.commit()
