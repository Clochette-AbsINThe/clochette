import logging
import os
from abc import abstractmethod
from functools import lru_cache
from typing import ClassVar, Literal, Optional

from pydantic import Field
from pydantic_settings import BaseSettings

logger = logging.getLogger("app.core.config")

SupportedLocales = Literal["en", "fr"]
SupportedEnvironments = Literal["development", "production", "test"]


class Settings(BaseSettings):
    """
    This class defines the application settings and configurations.

    Attributes:
    -----------
    ALERT_BACKEND : str
        The alert backend to use.
    API_V1_PREFIX : str
        The prefix for API v1 routes.
    LOCALE : SupportedLocales
        The supported locale for the application.
    ALLOWED_HOSTS : list[str]
        The list of allowed hosts for the application.
    LOG_LEVEL : int
        The log level for the application.
    ENVIRONMENT : SupportedEnvironments
        The environment for the application.

    ACCESS_TOKEN_EXPIRE_MINUTES : int
        The expiration time for access tokens in minutes.
    SECRET_KEY : str
        The secret key for JWT authentication.
    ALGORITHM : str
        The algorithm to use for JWT authentication.

    BASE_ACCOUNT_USERNAME : str
        The username for the base account.
    BASE_ACCOUNT_PASSWORD : str
        The password for the base account.

    POSTGRES_HOST : str | None
        The host for the PostgreSQL database.
    POSTGRES_PORT : int
        The port for the PostgreSQL database.
    POSTGRES_DB : str | None
        The name of the PostgreSQL database.
    POSTGRES_USER : str | None
        The username for the PostgreSQL database.
    POSTGRES_PASSWORD : str | None
        The password for the PostgreSQL database.
    DATABASE_URI : str
        The URI for the database.

    GITHUB_USER : str
        The username for the GitHub account.
    GITHUB_TOKEN : str
        The token for the GitHub account.
    ISSUE_LABELS : str
        The labels for GitHub issues.
    REPOSITORY_NAME : str
        The name of the GitHub repository.
    REPOSITORY_OWNER : str
        The owner of the GitHub repository.
    """

    ALERT_BACKEND: str
    API_V1_PREFIX: str = "/api/v1"
    API_V2_PREFIX: str = "/api/v2"
    LOCALE: SupportedLocales

    ALLOWED_HOSTS: list[str]

    LOG_LEVEL: int
    ENVIRONMENT: SupportedEnvironments

    # Authentication config

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1  # 1 day
    SECRET_KEY: str
    ALGORITHM: str = "HS256"  # TODO: Change to ES256 in the future

    # Base account config

    BASE_ACCOUNT_USERNAME: str
    BASE_ACCOUNT_PASSWORD: str

    # Database config

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    @property
    @abstractmethod
    def DATABASE_URI(self) -> str:
        """The URI for the database."""

    # Github config

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
    SECRET_KEY: str = Field(
        default="6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e",
    )

    """Base account config """

    BASE_ACCOUNT_USERNAME: str = "admin"
    BASE_ACCOUNT_PASSWORD: str = "admin-password*45"

    """Database config"""

    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "clochette"
    POSTGRES_USER: str = "clochette"
    POSTGRES_PASSWORD: str = "clochette"

    """Github config"""

    GITHUB_USER: str = "test_github_user"
    GITHUB_TOKEN: str = "test_github_token"

    ISSUE_LABELS: str = "Backend,bug,bot"
    REPOSITORY_NAME: str = "test_repository_name"
    REPOSITORY_OWNER: str = "test_repository_owner"

    POSTGRES_DATABASE_URI: ClassVar[
        str
    ] = "postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}".format(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        db=POSTGRES_DB,
    )
    SQLITE_DATABASE_URI: ClassVar[str] = "sqlite+aiosqlite:///./clochette.db"

    # you can change it to either SQLITE_DATABASE_URI or POSTGRES_DATABASE_URI
    @property
    def DATABASE_URI(self) -> str:
        value = os.environ.get("DB_TYPE")
        if value == "POSTGRES":
            return self.POSTGRES_DATABASE_URI

        return self.SQLITE_DATABASE_URI


class ConfigProduction(Settings):
    ALERT_BACKEND: str = "terminal"

    LOCALE: SupportedLocales = "en"

    ALLOWED_HOSTS: list[str] = ["*"]  # ! Shouldn't be set to ["*"] in production!

    LOG_LEVEL: int = logging.INFO
    ENVIRONMENT: SupportedEnvironments = "production"

    """ Authentication config"""
    # openssl rand -hex 32
    SECRET_KEY: str = Field(...)

    """Base account config """

    BASE_ACCOUNT_USERNAME: str = "admin"
    BASE_ACCOUNT_PASSWORD: str = Field(...)

    """Database config"""

    POSTGRES_HOST: str = Field(...)
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = Field(...)
    POSTGRES_USER: str = Field(...)
    POSTGRES_PASSWORD: str = Field(...)

    """Github config"""

    GITHUB_USER: str = Field(...)
    GITHUB_TOKEN: str = Field(...)

    ISSUE_LABELS: str = "Backend,bug,bot"
    REPOSITORY_NAME: str = Field(...)
    REPOSITORY_OWNER: str = Field(...)

    @property
    def DATABASE_URI(self) -> str:
        return "postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}".format(
            user=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            db=self.POSTGRES_DB,
        )


class ConfigTest(Settings):
    ALERT_BACKEND: str = "terminal"
    LOCALE: SupportedLocales = "en"
    ALLOWED_HOSTS: list[str] = ["*"]

    LOG_LEVEL: int = logging.DEBUG
    ENVIRONMENT: SupportedEnvironments = "test"

    """ Authentication config"""
    SECRET_KEY: str = "6a50e3ddeef70fd46da504d8d0a226db7f0b44dcdeb65b97751cf2393b33693e"

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

    @property
    def DATABASE_URI(self) -> str:
        return "sqlite+aiosqlite:///./test_clochette.db"


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
        return ConfigProduction()  # type: ignore

    if _env == "test":
        return ConfigTest()

    raise ValueError(f"Invalid environment {_env}")


settings = select_settings()
