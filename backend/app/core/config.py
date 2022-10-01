from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator


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

    SQLALCHEMY_DATABASE_URI: str | None = "postgresql://clochette:some_really_weird_password@db"

    class Config:
        case_sensitive = True


settings = Settings()
