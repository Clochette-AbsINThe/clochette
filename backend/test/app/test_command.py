from unittest.mock import patch

import pytest

from app.command import main


@pytest.mark.asyncio
@patch("app.command.reset_db")
async def test_reset_db(mock_reset_db):
    args = ["test", "reset"]
    with patch("sys.argv", args):
        await main("reset")
    mock_reset_db.assert_called_once()


@pytest.mark.asyncio
@patch("app.command.reset_db")
@patch("app.command.migrate_db")
@patch("app.command.init_db")
async def test_init_db(mock_init_db, mock_migrate_db, mock_reset_db):
    args = ["test", "init", "--yes", "--bypass-revision"]
    with patch("sys.argv", args):
        await main("init")
    mock_reset_db.assert_called_once()
    mock_migrate_db.assert_called_once_with(bypass_revision=True)
    mock_init_db.assert_called_once()


@pytest.mark.asyncio
async def test_init_db_no():
    args = ["test", "init"]
    with patch("sys.argv", args):
        with patch("builtins.input", return_value="n"):
            await main("init")


@pytest.mark.asyncio
@patch("app.command.migrate_db")
async def test_migrate_db(mock_migrate_db):
    args = ["test", "migrate", "--bypass-revision", "--force"]
    with patch("sys.argv", args):
        await main("migrate")
    mock_migrate_db.assert_called_once_with(bypass_revision=True, force=True)


@pytest.mark.asyncio
@patch("app.command.open_api")
async def test_open_api(mock_open_api):
    args = ["test", "openapi", "--output", "test.json"]
    with patch("sys.argv", args):
        await main("openapi")
    mock_open_api.assert_called_once_with("test.json")


@pytest.mark.asyncio
@patch("app.command.dump_db")
async def test_dump_db(mock_dump_db):
    args = ["test", "dump", "--output", "test.json"]
    with patch("sys.argv", args):
        await main("dump")
    mock_dump_db.assert_called_once_with("test.json")


@pytest.mark.asyncio
@patch("app.command.load_db")
async def test_load_db(mock_load_db):
    args = ["test", "load", "--input", "test.json"]
    with patch("sys.argv", args):
        await main("load")
    mock_load_db.assert_called_once_with("test.json")


@pytest.mark.asyncio
@patch("app.command.execute_sql_command")
async def test_execute_sql_command(mock_execute_sql_command):
    args = ["test", "execute", "SELECT * FROM users"]
    with patch("sys.argv", args):
        await main("execute")
    mock_execute_sql_command.assert_called_once_with("SELECT * FROM users")
