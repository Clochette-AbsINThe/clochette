import pytest

from app.core.config import (
    ConfigDevelopment,
    ConfigProduction,
    ConfigTest,
    select_settings,
)


def test_env_dev(monkeypatch: pytest.MonkeyPatch):
    select_settings.cache_clear()
    assert isinstance(select_settings("development"), ConfigDevelopment)


def test_env_dev_override_db_type(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DB_TYPE", "POSTGRES")
    select_settings.cache_clear()
    assert isinstance(select_settings("development"), ConfigDevelopment)
    assert (
        select_settings("development").DATABASE_URI
        == ConfigDevelopment.POSTGRES_DATABASE_URI
    )


def test_env_dev_override_db_type_sqlite(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("DB_TYPE", "SQLITE")
    select_settings.cache_clear()
    assert isinstance(select_settings("development"), ConfigDevelopment)
    assert (
        select_settings("development").DATABASE_URI
        == ConfigDevelopment.SQLITE_DATABASE_URI
    )


def test_env_prod(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("SECRET_KEY", "FAKE_VALUE")
    monkeypatch.setenv("BASE_ACCOUNT_PASSWORD", "FAKE_VALUE")
    monkeypatch.setenv("POSTGRES_HOST", "localhost")
    monkeypatch.setenv("POSTGRES_DB", "FAKE_VALUE")
    monkeypatch.setenv("POSTGRES_USER", "FAKE_VALUE")
    monkeypatch.setenv("POSTGRES_PASSWORD", "FAKE_VALUE")
    monkeypatch.setenv("GITHUB_USER", "FAKE_VALUE")
    monkeypatch.setenv("GITHUB_TOKEN", "FAKE_VALUE")
    monkeypatch.setenv("ISSUE_LABELS", "FAKE_VALUE")
    monkeypatch.setenv("REPOSITORY_NAME", "FAKE_VALUE")
    monkeypatch.setenv("REPOSITORY_OWNER", "FAKE_VALUE")

    assert isinstance(select_settings("production"), ConfigProduction)
    assert (
        select_settings("production").DATABASE_URI
        == "postgresql+asyncpg://FAKE_VALUE:FAKE_VALUE@localhost:5432/FAKE_VALUE"
    )


def test_env_test():
    settings = select_settings("test")
    assert isinstance(settings, ConfigTest)
    assert (
        settings.SECRET_KEY
        == "6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e"
    )


def test_env_invalid():
    with pytest.raises(ValueError) as excinfo:
        select_settings("invalid")

    assert excinfo.value.args[0] == "Invalid environment invalid"
