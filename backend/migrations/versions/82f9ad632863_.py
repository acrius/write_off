"""empty message

Revision ID: 82f9ad632863
Revises: 8973b513f1ac
Create Date: 2017-04-27 15:49:41.288365

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82f9ad632863'
down_revision = '8973b513f1ac'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('acts', sa.Column('subdivision', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'acts', 'subdivisions', ['subdivision'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'acts', type_='foreignkey')
    op.drop_column('acts', 'subdivision')
    # ### end Alembic commands ###
