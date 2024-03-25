import unittest
from typing import cast

import pytest
from fastapi.testclient import TestClient

from app.db.databases.sqlite import SqliteDatabase
from app.dependencies import get_current_active_account, get_db


async def override_get_current_active_account():
    pass


class BaseTest(unittest.IsolatedAsyncioTestCase):
    @pytest.fixture(autouse=True)
    def inject_fixtures(self, client: TestClient, caplog: pytest.LogCaptureFixture, tmp_path):
        self._caplog = caplog
        self._client = client
        self._tmp_path = tmp_path

    def wipe_dependencies_overrides(self):
        self._client.app.dependency_overrides.clear()  # type: ignore

    async def asyncSetUp(self) -> None:
        sqlite_path = "sqlite+aiosqlite:///" + str(self._tmp_path / "test.db")
        self._client.app.dependency_overrides[get_current_active_account] = override_get_current_active_account  # type: ignore

        cast(SqliteDatabase, get_db).setup(sqlite_path)
        await cast(SqliteDatabase, get_db).create_all(no_drop=True)
