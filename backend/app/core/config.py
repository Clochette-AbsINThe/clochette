import os

from humps import camelize
from pydantic import AnyHttpUrl, BaseModel, BaseSettings, EmailStr, validator

class DefaultModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class Settings(BaseSettings):
    ALERT_BACKEND: str = 'github'

    API_V1_PREFIX: str = "/api/v1"

    ALLOWED_HOSTS: list[str] = ["*"] # Shouldn't be set to ["*"] in production!

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

    POSTGRES_HOST = os.environ.get('POSTGRES_HOST')
    POSTGRES_PORT = os.environ.get('POSTGRES_PORT')
    POSTGRES_DB = os.environ.get('POSTGRES_DB')
    POSTGRES_USER = os.environ.get('POSTGRES_USER')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
    
    SQLALCHEMY_DATABASE_URI: str | None = 'postgresql://{user}:{password}@{host}:{port}/{db}'.format(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        db=POSTGRES_DB
    )

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
