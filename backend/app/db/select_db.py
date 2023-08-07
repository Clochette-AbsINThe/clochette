from functools import lru_cache

from app.core.config import SupportedEnvironments, settings
from app.db.databases.postgres import PostgresDatabase
from app.db.databases.sqlite import SqliteDatabase


@lru_cache()
def select_db(
    env: SupportedEnvironments = settings.ENVIRONMENT,
    db_uri: str = settings.DATABASE_URI,
):
    """Selects the database based on the environment.

    Args:
        env (SUPPORTED_ENVIRONMENTS, optional): Environment to get the database for. Defaults to settings.ENVIRONMENT.
        db_uri (str, optional): Database URI. Defaults to settings.DATABASE_URI.

    Raises:
        ValueError: If an database type is not supported, e.g. MySQL or Non Async.


    Returns:
        Database: The database.
    """
    if env == "production":
        return PostgresDatabase()
    if env == "development":
        db_type = db_uri.split("://")[0]

        if db_type == "sqlite+aiosqlite":
            return SqliteDatabase()

        if db_type == "postgresql+asyncpg":
            return PostgresDatabase()

        raise ValueError("Unsupported database type")

    return SqliteDatabase()
