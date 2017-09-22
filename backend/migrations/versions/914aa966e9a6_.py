"""empty message

Revision ID: 914aa966e9a6
Revises: 82f9ad632863
Create Date: 2017-04-28 10:46:06.955407

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '914aa966e9a6'
down_revision = '82f9ad632863'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tables_from_acts', sa.Column('dateWriteOff', sa.String(length=8), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tables_from_acts', 'dateWriteOff')
    # ### end Alembic commands ###
