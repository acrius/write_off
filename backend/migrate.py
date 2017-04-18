from sys import path
import re
import sys

from alembic.config import main

from os.path import dirname, abspath

path.append(dirname(abspath(__file__)))

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(main())
