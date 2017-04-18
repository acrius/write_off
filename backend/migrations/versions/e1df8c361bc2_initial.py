"""Initial

Revision ID: e1df8c361bc2
Revises: 
Create Date: 2017-04-12 10:53:19.143106

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e1df8c361bc2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subdivisions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=12), nullable=True),
    sa.Column('name', sa.String(length=125), nullable=True),
    sa.Column('update_time', sa.String(length=8), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('storages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=12), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('subdivision', sa.Integer(), nullable=True),
    sa.Column('frp', sa.String(length=155), nullable=True),
    sa.ForeignKeyConstraint(['subdivision'], ['subdivisions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('the_main_things',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('code', sa.String(length=8), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('subdivision', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['subdivision'], ['subdivisions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('acts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.String(length=8), nullable=True),
    sa.Column('storage', sa.Integer(), nullable=True),
    sa.Column('receiver_storage', sa.Integer(), nullable=True),
    sa.Column('act_type', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Integer(), nullable=True),
    sa.Column('is_upload', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['receiver_storage'], ['storages.id'], ),
    sa.ForeignKeyConstraint(['storage'], ['storages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('remains',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('storage', sa.Integer(), nullable=True),
    sa.Column('account', sa.String(length=10), nullable=True),
    sa.Column('code', sa.String(length=15), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('unit', sa.String(length=10), nullable=True),
    sa.Column('sum', sa.String(length=35), nullable=True),
    sa.Column('amount', sa.String(length=35), nullable=True),
    sa.ForeignKeyConstraint(['storage'], ['storages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tables_from_acts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('act', sa.Integer(), nullable=True),
    sa.Column('code', sa.String(length=15), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('account', sa.String(length=10), nullable=True),
    sa.Column('main_thing', sa.String(length=8), nullable=True),
    sa.Column('amount', sa.String(length=25), nullable=True),
    sa.Column('date_of_write_off', sa.String(length=8), nullable=True),
    sa.ForeignKeyConstraint(['act'], ['acts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tables_from_acts')
    op.drop_table('remains')
    op.drop_table('acts')
    op.drop_table('the_main_things')
    op.drop_table('storages')
    op.drop_table('subdivisions')
    # ### end Alembic commands ###
