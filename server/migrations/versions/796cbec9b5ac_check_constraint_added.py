"""check constraint added

Revision ID: 796cbec9b5ac
Revises: ce25e53603f8
Create Date: 2024-06-14 01:28:03.653495

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "796cbec9b5ac"
down_revision = "ce25e53603f8"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.add_column(sa.Column("reciver_id", sa.BigInteger(), nullable=True))
        batch_op.create_foreign_key(None, "accounts", ["reciver_id"], ["id"])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.drop_constraint(None, type_="foreignkey")
        batch_op.drop_column("reciver_id")

    # ### end Alembic commands ###
