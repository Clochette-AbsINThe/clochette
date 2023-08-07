from pydantic import Field

from app.schemas.base import DefaultModel


class RootResponse(DefaultModel):
    msg: str = Field(..., description="Hello, World!")


class HealthResponse(DefaultModel):
    status: str = Field(..., description="OK")


class VersionResponse(DefaultModel):
    version: str = Field(..., description="Version of the API.")
