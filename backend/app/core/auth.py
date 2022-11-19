from datetime import datetime, timedelta
from typing import MutableMapping

from fastapi.security import OAuth2PasswordBearer
from jose import jwt

from app.core.config import settings
from app.core.security import verify_password
from app.crud.crud_account import account as accounts
from app.models.account import Account


JWTPayloadMapping = MutableMapping[
    str,
    datetime | bool | str | list[str] | list[int]
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f'{settings.API_V1_PREFIX}/auth/login') # TODO: Shouldn't be hardcoded


def authenticate(username: str, password: str) -> Account | None:
    account: Account = accounts.query(limit=1, username=username)
    if account is None:
        return None
    if not verify_password(password, account.password):
        return None
    return account


def create_access_token(*, subject: str) -> str:
    return _create_token(
        subject=subject,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type='access_token'
    )


def _create_token(subject: str, expires_delta: timedelta, token_type: str) -> str:
    to_encode: JWTPayloadMapping = {
        'sub': subject,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + expires_delta,
        'token_type': token_type
    }
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.ALGORITHM
    )