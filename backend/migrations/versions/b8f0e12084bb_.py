"""empty message

Revision ID: b8f0e12084bb
Revises: e4e4a93db60b
Create Date: 2017-09-19 14:22:18.605162

"""
from alembic import op
import sqlalchemy as sa

from db import create_session
from models import Storekeeper
from settings import DATABASES


# revision identifiers, used by Alembic.
revision = 'b8f0e12084bb'
down_revision = 'e4e4a93db60b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('storekeeper',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    session = create_session(DATABASES['main'].metadata.bind)
    session.add_all([Storekeeper(name="Донец Д.Н."), Storekeeper(name="Сучков Д.Ю.")])
    session.commit()
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('storekeeper')
    # ### end Alembic commands ###
