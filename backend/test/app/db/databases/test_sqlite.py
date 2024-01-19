from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch

import pytest

from app.db.databases.sqlite import SqliteDatabase


class TestSqliteDatabase:
    def test_setup(self, tmp_path):
        db = SqliteDatabase()
        db.setup("sqlite+aiosqlite:///" + str(tmp_path / "test.db"))

    @pytest.mark.asyncio
    async def test_drop(self, tmp_path):
        db = SqliteDatabase()
        db.setup("sqlite+aiosqlite:///" + str(tmp_path / "test.db"))

        await db.drop()

    @pytest.mark.asyncio
    async def test_create_all(self, tmp_path):
        db = SqliteDatabase()
        db.setup("sqlite+aiosqlite:///" + str(tmp_path / "test.db"))

        await db.create_all()


class TestSqliteDatabaseProduction(IsolatedAsyncioTestCase):
    @patch("app.db.databases.sqlite.settings.ENVIRONMENT", "production")
    def test_setup(self):
        db = SqliteDatabase()

        with self.assertRaises(ValueError):
            db.setup()

    @patch("app.db.databases.sqlite.settings.ENVIRONMENT", "production")
    async def test_drop(self):
        db = SqliteDatabase()

        with self.assertRaises(ValueError):
            await db.drop()

    @patch("app.db.databases.sqlite.settings.ENVIRONMENT", "production")
    async def test_create_all(self):
        db = SqliteDatabase()

        with self.assertRaises(ValueError):
            await db.create_all()
