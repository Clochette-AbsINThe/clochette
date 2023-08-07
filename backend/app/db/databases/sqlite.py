import os
from typing import Any

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.base_class import Base
from app.db.databases.database_interface import DatabaseInterface


class SqliteDatabase(DatabaseInterface):
    def setup(
        self, path: str = settings.DATABASE_URI
    ) -> async_sessionmaker[AsyncSession]:
        """
        Create a new SQLAlchemy engine and sessionmaker.
        """
        if settings.ENVIRONMENT == "production":
            raise ValueError("Use migrations in production")

        self.async_engine: AsyncEngine = create_async_engine(path)
        self.async_sessionmaker = async_sessionmaker(
            self.async_engine, class_=AsyncSession, expire_on_commit=False
        )
        return self.async_sessionmaker

    async def drop(self, path: str = settings.DATABASE_URI) -> None:
        """
        Drop the database, by deleting the db file.
        """
        if settings.ENVIRONMENT == "production":
            raise ValueError("Use migrations in production")

        file_name = path.split("sqlite:///")[-1]
        if os.path.exists(file_name):  # pragma: no cover
            os.remove(file_name)

    async def create_all(self, no_drop: bool = False) -> None:
        """
        Create all tables, with a drop first if they already exist.
        """
        if settings.ENVIRONMENT == "production":
            raise ValueError("Use migrations in production")

        def wrapper(session: Session, method: Any) -> Any:
            """
            Wrapper to get a connection from the session and close it after the method is called.
            """
            connection = session.connection()
            return method(connection)

        metadata = Base.metadata
        async with self.get_session() as session:
            async with session.begin():
                if not no_drop:
                    await session.run_sync(wrapper, metadata.drop_all)
                await session.run_sync(wrapper, metadata.create_all)
