from abc import ABC, abstractmethod
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


class Database(ABC):
    def __init__(self):
        self.async_sessionmaker: sessionmaker | None = None

    async def __call__(self) -> AsyncIterator[AsyncSession]:
        """
        Create a new session to interact with the database.
        To be used by FastAPI's dependency injection system.
        """
        if not self.async_sessionmaker:
            raise ValueError("Database not initialized")

        async with self.async_sessionmaker() as session:
            yield session

    @abstractmethod
    def setup(self) -> None:
        ...

class PostgresDatabase(Database):
    def setup(self) -> None:
        """
        Create a new SQLAlchemy engine and sessionmaker.
        """
        async_engine = create_async_engine(
            settings.SQLALCHEMY_DATABASE_URI,
        )
        self.async_sessionmaker = sessionmaker(
            async_engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
