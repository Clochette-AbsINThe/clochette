import logging
import os
from functools import lru_cache
from typing import Literal, Optional

from pydantic_settings import BaseSettings

logger = logging.getLogger("app.core.config")

SupportedLocales = Literal["en", "fr"]
SupportedEnvironments = Literal["development", "production", "test"]


class Settings(BaseSettings):
    ALERT_BACKEND: str
    API_V1_PREFIX: str = "/api/v1"
    LOCALE: SupportedLocales

    ALLOWED_HOSTS: list[str]

    LOG_LEVEL: int
    ENVIRONMENT: SupportedEnvironments

    """ Authentication config"""

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1  # 1 day
    JWT_SECRET_KEY: str
    ALGORITHM: str = "HS256"  # TODO: Change to ES256 in the future

    """Base account config """

    BASE_ACCOUNT_USERNAME: str
    BASE_ACCOUNT_PASSWORD: str

    """Database config"""

    POSTGRES_HOST: str | None = None
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str | None = None
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None

    DATABASE_URI: str

    ###

    """Github config"""

    GITHUB_USER: str
    GITHUB_TOKEN: str

    ISSUE_LABELS: str
    REPOSITORY_NAME: str
    REPOSITORY_OWNER: str


class ConfigDevelopment(Settings):
    ALERT_BACKEND: str = "terminal"

    LOCALE: SupportedLocales = "fr"

    ALLOWED_HOSTS: list[str] = ["*"]

    LOG_LEVEL: int = logging.DEBUG
    ENVIRONMENT: SupportedEnvironments = "development"

    """ Authentication config"""
    # openssl rand -hex 32
    JWT_SECRET_KEY: str = os.environ.get(
        "SECRET_KEY", "6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e"
    )

    """Base account config """

    BASE_ACCOUNT_USERNAME: str = os.environ.get(
        "BASE_ACCOUNT_USERNAME", default="admin"
    )
    BASE_ACCOUNT_PASSWORD: str = os.environ.get(
        "BASE_ACCOUNT_PASSWORD", "deve_password*45"
    )

    """Database config"""

    POSTGRES_HOST: str | None = os.environ.get("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.environ.get("POSTGRES_PORT", default=5432))
    POSTGRES_DB: str | None = os.environ.get("POSTGRES_DB", "clochette")
    POSTGRES_USER: str | None = os.environ.get("POSTGRES_USER", "clochette")
    POSTGRES_PASSWORD: str | None = os.environ.get("POSTGRES_PASSWORD", "clochette")

    """Github config"""

    GITHUB_USER: str = os.environ.get("GITHUB_USER", default="test_github_user")
    GITHUB_TOKEN: str = os.environ.get("GITHUB_TOKEN", default="test_github_token")

    ISSUE_LABELS: str = os.environ.get("ISSUES_LABELS", default="Backend,bug,bot")
    REPOSITORY_NAME: str = os.environ.get(
        "REPOSITORY_NAME", default="test_repository_name"
    )
    REPOSITORY_OWNER: str = os.environ.get(
        "REPOSITORY_OWNER", default="test_repository_owner"
    )

    POSTGRES_DATABASE_URI: str = (
        "postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}".format(
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            db=POSTGRES_DB,
        )
    )
    SQLITE_DATABASE_URI: str = "sqlite+aiosqlite:///./clochette.db"

    # you can change it to either SQLITE_DATABASE_URI or POSTGRES_DATABASE_URI
    DATABASE_URI: str = SQLITE_DATABASE_URI


class ConfigProduction(Settings):
    ALERT_BACKEND: str = os.environ.get("ALERT_BACKEND", default="terminal")

    LOCALE: SupportedLocales = os.environ.get("LOCALE", default="en")  # type: ignore

    ALLOWED_HOSTS: list[str] = ["*"]  # ! Shouldn't be set to ["*"] in production!

    LOG_LEVEL: int = logging.INFO
    ENVIRONMENT: SupportedEnvironments = "production"

    """ Authentication config"""
    # openssl rand -hex 32
    JWT_SECRET_KEY: str = os.environ.get("SECRET_KEY")  # type: ignore

    """Base account config """

    BASE_ACCOUNT_USERNAME: str = os.environ.get(
        "BASE_ACCOUNT_USERNAME", default="admin"
    )
    BASE_ACCOUNT_PASSWORD: str = os.environ.get("BASE_ACCOUNT_PASSWORD")  # type: ignore

    """Database config"""

    POSTGRES_HOST: str | None = os.environ.get("POSTGRES_HOST")
    POSTGRES_PORT: int = int(os.environ.get("POSTGRES_PORT", default=5432))
    POSTGRES_DB: str | None = os.environ.get("POSTGRES_DB")
    POSTGRES_USER: str | None = os.environ.get("POSTGRES_USER")
    POSTGRES_PASSWORD: str | None = os.environ.get("POSTGRES_PASSWORD")

    """Github config"""

    GITHUB_USER: str = os.environ.get("GITHUB_USER")  # type: ignore
    GITHUB_TOKEN: str = os.environ.get("GITHUB_TOKEN")  # type: ignore

    ISSUE_LABELS: str = os.environ.get("ISSUES_LABELS", default="Backend,bug,bot")
    REPOSITORY_NAME: str = os.environ.get("REPOSITORY_NAME")  # type: ignore
    REPOSITORY_OWNER: str = os.environ.get("REPOSITORY_OWNER")  # type: ignore

    DATABASE_URI: str = (
        "postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}".format(
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            db=POSTGRES_DB,
        )
    )


class ConfigTest(Settings):
    ALERT_BACKEND: str = "terminal"
    LOCALE: SupportedLocales = "en"
    ALLOWED_HOSTS: list[str] = ["*"]

    LOG_LEVEL: int = logging.DEBUG
    ENVIRONMENT: SupportedEnvironments = "test"

    """ Authentication config"""
    JWT_SECRET_KEY: str = (
        "6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e"
    )

    """Base account config """
    BASE_ACCOUNT_USERNAME: str = "test"
    BASE_ACCOUNT_PASSWORD: str = "test_password*45"  # to match the password policy

    ###

    """Database config"""
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str | None = "test_db"
    POSTGRES_USER: str | None = "test_user"
    POSTGRES_PASSWORD: str | None = "test_password"

    """Github config"""
    GITHUB_USER: str = "test_github_user"
    GITHUB_TOKEN: str = "test_github_token"

    ISSUE_LABELS: str = "Backend,bug,bot"
    REPOSITORY_NAME: str = "test_repository_name"
    REPOSITORY_OWNER: str = "test_repository_owner"

    DATABASE_URI: str = "sqlite+aiosqlite:///./test_clochette.db"


env = os.getenv("ENVIRONMENT", "development")


@lru_cache()
def select_settings(_env: Optional[str] = env):
    """
    Returns the application settings based on the environment specified.

    Args:
        _env (Optional[str], optional): Environment to get the settings for. Defaults to env.

    Raises:
        ValueError: If an invalid environment is specified.

    Returns:
        Settings: The application settings.
    """
    logger.info(f"Loading settings for environment {_env}")
    if _env == "development":
        return ConfigDevelopment()

    if _env == "production":
        return ConfigProduction()

    if _env == "test":
        return ConfigTest()

    raise ValueError(f"Invalid environment {_env}")


settings = select_settings()
