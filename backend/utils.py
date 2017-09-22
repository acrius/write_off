from settings import DATABASES
from db import create_session
from models import Alembic

def replace_all(string, replace_chars, target_char):
    for replace_char in replace_chars:
        string = string.replace(replace_char, target_char)
    return string

def get_current_revision():
    '''
    Get current alembic revision.
    '''
    session = create_session(DATABASES['main'].metadata.bind)
    return session.query(Alembic.version_num).first()[0]
