from datetime import datetime, timedelta
from typing import MutableMapping

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings



JWTPayloadMapping = MutableMapping[
    str,
    datetime | bool | str | list[str] | list[int]
]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def is_hashed_password(password: str) -> bool:
    return pwd_context.identify(password) == 'bcrypt'

def get_password_hash(password):
    return pwd_context.hash(password)


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