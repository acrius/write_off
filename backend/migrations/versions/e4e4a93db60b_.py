"""empty message

Revision ID: e4e4a93db60b
Revises: f007fdc5b185
Create Date: 2017-05-02 16:17:21.101264

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e4e4a93db60b'
down_revision = 'f007fdc5b185'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tables_from_acts', sa.Column('work_name', sa.String(length=200), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tables_from_acts', 'work_name')
    # ### end Alembic commands ###