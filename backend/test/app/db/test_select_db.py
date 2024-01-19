import pytest

from app.db.databases.postgres import PostgresDatabase
from app.db.databases.sqlite import SqliteDatabase
from app.db.select_db import select_db


def test_select_db_production():
    db = select_db("production")
    assert isinstance(db, PostgresDatabase)


def test_select_db_development_sqlite():
    db = select_db("development", "sqlite+aiosqlite:///test.db")
    assert isinstance(db, SqliteDatabase)


def test_select_db_development_postgresql():
    db = select_db("development", "postgresql+asyncpg://user:password@localhost/db")
    assert isinstance(db, PostgresDatabase)


def test_select_db_development_unsupported():
    with pytest.raises(ValueError) as e:
        select_db("development", "mysql://user:password@localhost/db")
    assert str(e.value) == "Unsupported database type"


def test_select_db_test():
    db = select_db("test")
    assert isinstance(db, SqliteDatabase)
