"""create 'customers' table

Revision ID: 744ce132cb43
Revises: ec129b234be2
Create Date: 2022-08-09 19:47:04.557363

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '744ce132cb43'
down_revision = 'ec129b234be2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('phone', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('customers')
    # ### end Alembic commands ###
