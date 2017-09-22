from sys import path
import re
import sys

from os.path import dirname, abspath, join
from shutil import copyfile
from datetime import datetime

from alembic.config import Config, main
from alembic.script import ScriptDirectory
from alembic import command

from settings import MAIN_DATABASE_PATH, PROJECT_PATH

from utils import replace_all, get_current_revision


path.append(PROJECT_PATH)


def backup_database():
    back_up_name = "{}.db".format(replace_all(str(datetime.now()), '- .:', ''))
    print(back_up_name)
    copyfile(MAIN_DATABASE_PATH, back_up_name)

def migrate():
    allembic_config = Config("alembic.ini")
    script = ScriptDirectory.from_config(allembic_config)
    if script.get_current_head() != get_current_revision():
        print("Detect new Migrations!!!")
        backup_database()
        print("Start migrations.")
        sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', 'migrate.py')
        sys.argv.append('upgrade')
        sys.argv.append('head')
        main()
        print("Finish migrations.")
    else:
        print("Not detected migrations.")

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(main())
