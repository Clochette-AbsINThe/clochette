from unittest import IsolatedAsyncioTestCase

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.databases.sqlite import SqliteDatabase


class TestDatabase(IsolatedAsyncioTestCase):
    async def test_get_session(self):
        db = SqliteDatabase()
        db.setup()

        session = db.get_session()
        second_session = db.get_session()

        # Check that the sessions are different
        self.assertNotEqual(session, second_session)

        await session.close()
        await second_session.close()

    async def test_get_session_no_setup(self):
        db = SqliteDatabase()

        with self.assertRaises(RuntimeError):
            db.get_session()

    async def test_call(self):
        db = SqliteDatabase()
        db.setup()

        session = db()
        second_session = db()

        # Check that the sessions are different
        self.assertNotEqual(session, second_session)

    async def test_context_manager(self):
        db = SqliteDatabase()
        db.setup()

        session = await anext(db())
        assert session is not None
        assert isinstance(session, AsyncSession)

    async def test_context_manager_no_setup(self):
        db = SqliteDatabase()

        with self.assertRaises(RuntimeError):
            await anext(db())

    async def test_shutdown(self):
        db = SqliteDatabase()
        db.setup()

        await db.shutdown()

    async def test_shutdown_no_setup(self):
        db = SqliteDatabase()

        await db.shutdown()
