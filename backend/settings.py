'''
Settings for project.
    :PROJECT_PATH: is absolute path for project directory.
    :DATABASES: is dictionary containg :sqlalchemy: declarative bases.
    :HOST: is dictionary containg :address: and :host: for run :Sainc: server.
'''
from os.path import dirname, abspath
from db import get_database

from secret import DATABASE_NAME, DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD

PROJECT_PATH = dirname(abspath(__file__))

MAIN_DATABASE_PATH = 'write-off.db'

DATABASES = {
    'main': get_database(
        echo=True,
        drivername='sqlite',
        database=MAIN_DATABASE_PATH),
    'outside': get_database(
        echo=True,
        drivername='mysql+pymysql',
        host=DATABASE_HOST,
        port=DATABASE_PORT,
        database=DATABASE_NAME,
        username=DATABASE_USER,
        password=DATABASE_PASSWORD,
        query={'charset': 'cp1251'}
    )
}

UPLOAD_ATTEMPTS_COUNT = 5

HOST = {
    'address': '0.0.0.0',
    'port': 8000
}
