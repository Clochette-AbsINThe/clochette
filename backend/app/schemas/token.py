from app.core.config import DefaultModel


class Token(DefaultModel):
    access_token: str
    token_type: str


class TokenData(DefaultModel):
    username: str | None = None