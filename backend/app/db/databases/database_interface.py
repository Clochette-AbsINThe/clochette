from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker


class DatabaseInterface(ABC):
    def __init__(self):
        self.async_sessionmaker: async_sessionmaker[AsyncSession] | None = None
        self.async_engine: AsyncEngine | None = None

    async def __call__(self) -> AsyncGenerator[AsyncSession, Any]:
        """
        Create a new session to interact with the database.
        To be used by FastAPI's dependency injection system.
        see https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/#a-database-dependency-with-yield
        ! This Must only be used by FastAPI's dependency injection system !
        """

        session = self.get_session()

        try:
            yield session
        finally:
            await session.close()

    @abstractmethod
    def setup(self) -> async_sessionmaker[AsyncSession]:  # pragma: no cover
        ...

    @abstractmethod
    async def drop(self) -> None:  # pragma: no cover
        ...

    async def shutdown(self) -> None:
        """
        Close the SQLAlchemy engine.
        """
        if self.async_engine:
            await self.async_engine.dispose()

    def get_session(self) -> AsyncSession:
        """
        Create a new session to interact with the database in a synchronous way.
        You need to close the session after using it.
        """
        if not self.async_sessionmaker:
            raise RuntimeError("Database not initialized")

        return self.async_sessionmaker()
