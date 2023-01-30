import os

from humps import camelize
from pydantic import AnyHttpUrl, BaseModel, BaseSettings, EmailStr, validator

class DefaultModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class Settings(BaseSettings):
    ALERT_BACKEND: str = os.environ.get('ALERT_BACKEND', default='terminal')

    API_V1_PREFIX: str = "/api/v1"

    LOCALE: str = os.environ.get('LOCALE', default='en')

    ALLOWED_HOSTS: list[str] = ["*"] # Shouldn't be set to ["*"] in production!

    ### Authentication config

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1 # 1 day
    JWT_SECRET_KEY: str = os.environ.get('SECRET_KEY') # openssl rand -hex 32
    ALGORITHM: str = "HS256" # TODO: Change to ES256 in the future

    ###

    ### Base account config ###

    BASE_ACCOUNT_USERNAME: str = os.environ.get('BASE_ACCOUNT_USERNAME', default='admin')
    BASE_ACCOUNT_PASSWORD: str = os.environ.get('BASE_ACCOUNT_PASSWORD')

    ###

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    BACKEND_CORS_ORIGIN: list[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGIN", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> str | list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    HOST_NAME: str = os.environ.get('HOST_NAME')

    ### Database config

    POSTGRES_HOST: str = os.environ.get('POSTGRES_HOST')
    POSTGRES_PORT: str = os.environ.get('POSTGRES_PORT')
    POSTGRES_DB: str = os.environ.get('POSTGRES_DB')
    POSTGRES_USER: str = os.environ.get('POSTGRES_USER')
    POSTGRES_PASSWORD: str = os.environ.get('POSTGRES_PASSWORD')
    
    SQLALCHEMY_DATABASE_URI: str | None = 'postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}'.format(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        db=POSTGRES_DB
    )
    ALEMBIC_DATABASE_URI: str | None = SQLALCHEMY_DATABASE_URI.replace('asyncpg', 'psycopg2')

    ###

    ### Github config

    GITHUB_USER: str = os.environ.get('GITHUB_USER')
    GITHUB_TOKEN: str = os.environ.get('GITHUB_TOKEN')

    ISSUE_LABELS: str = os.environ.get('ISSUES_LABELS')
    REPOSITORY_NAME: str = os.environ.get('REPOSITORY_NAME')
    REPOSITORY_OWNER: str = os.environ.get('REPOSITORY_OWNER')


    ###

    class Config:
        case_sensitive = True


settings = Settings()
