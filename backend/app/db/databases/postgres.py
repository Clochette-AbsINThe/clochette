import asyncpg
from sqlalchemy import URL, text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings
from app.db.databases.database_interface import DatabaseInterface


class PostgresDatabase(DatabaseInterface):
    def setup(self) -> async_sessionmaker[AsyncSession]:
        """
        Create a new SQLAlchemy engine and sessionmaker.
        """
        self.async_engine: AsyncEngine = create_async_engine(
            URL.create(
                drivername="postgresql+asyncpg",
                username=settings.POSTGRES_USER,
                password=settings.POSTGRES_PASSWORD,
                host=settings.POSTGRES_HOST,
                port=settings.POSTGRES_PORT,
                database=settings.POSTGRES_DB,
            ),
            pool_pre_ping=True,
        )
        self.async_sessionmaker = async_sessionmaker(
            self.async_engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
        return self.async_sessionmaker

    async def drop(self) -> None:
        """
        Clean the database from all tables.
        """
        connection: asyncpg.connection.Connection = await asyncpg.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            database=settings.POSTGRES_DB,
        )
        await connection.execute("DROP SCHEMA public CASCADE")
        await connection.execute("CREATE SCHEMA public")
        await connection.close()

    async def drop_alembic_version(self) -> None:
        """
        Drop the alembic_version table.
        """
        async with self.get_session() as session:
            await session.execute(text("DROP TABLE IF EXISTS alembic_version"))
            await session.commit()
