from pydantic import BaseModel

from app.schemas.base import DefaultModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(DefaultModel):
    username: str | None = None
    scopes: list[str] = []
