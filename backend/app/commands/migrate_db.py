import logging
import shlex
import subprocess

from app.db.select_db import SqliteDatabase
from app.dependencies import get_db

logger = logging.getLogger("app.command")


async def migrate_db(bypass_revision: bool = False, force: bool = False) -> None:
    """
    Migrates the database depending on the current engine;
    If the engine is SQLite, it will bypass alembic and use the built-in create_all() method.
    If the engine is not SQLite, it will use alembic to migrate the database.

    Args:
    - bypass_revision (bool, optional): Whether to bypass the revision step. Defaults to False.
    - force (bool, optional): Whether to force migration. Defaults to False.
    """
    # If force is true, we need to bypass revision and regenerate the migration
    logger.info("Migrating database")

    if isinstance(get_db, SqliteDatabase):
        logger.info("Using SQLite database, skipping alembic")
        await get_db.create_all()
        logger.info("Migrations completed.")
        return

    if force:
        await get_db.drop_alembic_version()

    if not bypass_revision:
        try:
            subprocess.run(
                shlex.split("alembic upgrade head"),
                check=True,
                stderr=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError:
            logger.warning("Upgrading database failed, trying to stamp")
            subprocess.run(
                shlex.split("alembic stamp head"),
                check=True,
            )
    else:
        logger.info("Skipping stamp")

    if not bypass_revision:
        subprocess.run(
            shlex.split("alembic revision --autogenerate"),
            check=True,
        )
    else:
        logger.info("Skipping revision")

    subprocess.run(
        shlex.split("alembic upgrade head"),
        check=True,
    )

    logger.info("Migrations completed.")
