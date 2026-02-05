"""moderation reports

Revision ID: 0003_reports
Revises: 0002_auth_hardening
Create Date: 2026-02-04 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0003_reports"
down_revision = "0002_auth_hardening"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()))

    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("reporter_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=True),
        sa.Column("reason", sa.String(), nullable=False),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["reporter_id"], ["users.id"], ),
        sa.ForeignKeyConstraint(["post_id"], ["posts.id"], ),
    )


def downgrade():
    op.drop_table("reports")
    op.drop_column("users", "is_admin")
