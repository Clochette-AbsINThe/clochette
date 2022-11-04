from humps import camelize
from pydantic import AnyHttpUrl, BaseModel, BaseSettings, EmailStr, validator

import os


class CamelModel(BaseModel):
    class Config:
        alias_generator = camelize
        allow_population_by_field_name = True


class Settings(BaseSettings):
    API_V1_PREFIX: str = "/api/v1"

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    BACKEND_CORS_ORIGIN: list[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGIN", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> str | list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

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

    class Config:
        case_sensitive = True


settings = Settings()
