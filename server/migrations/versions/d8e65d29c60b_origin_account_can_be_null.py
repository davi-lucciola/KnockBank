"""origin account can be null

Revision ID: d8e65d29c60b
Revises: 11ba600c4d43
Create Date: 2024-06-14 18:11:41.893621

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "d8e65d29c60b"
down_revision = "11ba600c4d43"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.alter_column(
            "origin_account_id",
            existing_type=mysql.BIGINT(display_width=20),
            nullable=True,
        )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("transactions", schema=None) as batch_op:
        batch_op.alter_column(
            "origin_account_id",
            existing_type=mysql.BIGINT(display_width=20),
            nullable=False,
        )

    # ### end Alembic commands ###
