from db import create_session
from models import Act, DATABASES

def change_storekeeper():
    session = create_session(DATABASES['main'].metadata.bind)
    for act in session.query(Act):
        if act.storekeeper =='Скубиро А.Л.':
            act.storekeeper = 'Донец Д.Н.'
    session.commit()
    print('Chacge storekeeper complete!!!')
