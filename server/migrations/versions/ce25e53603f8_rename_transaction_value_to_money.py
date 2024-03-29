"""[rename] - transaction: value to money

Revision ID: ce25e53603f8
Revises: ecc7085c20b2
Create Date: 2024-02-28 02:08:50.935374

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "ce25e53603f8"
down_revision = "ecc7085c20b2"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("money", sa.Numeric(precision=10, scale=2), nullable=False)
        )
        batch_op.alter_column(
            "transaction_type",
            existing_type=mysql.INTEGER(display_width=11),
            nullable=False,
        )
        batch_op.drop_column("value")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("value", mysql.DECIMAL(precision=10, scale=0), nullable=False)
        )
        batch_op.alter_column(
            "transaction_type",
            existing_type=mysql.INTEGER(display_width=11),
            nullable=True,
        )
        batch_op.drop_column("money")

    # ### end Alembic commands ###
