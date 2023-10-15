from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    is_hashed_password,
    verify_password,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def test_verify_password():
    plain_password = "password"
    hashed_password = pwd_context.hash(plain_password)
    assert verify_password(plain_password, hashed_password)
    assert not verify_password("wrong_password", hashed_password)


def test_is_hashed_password():
    plain_password = "password"
    hashed_password = pwd_context.hash(plain_password)
    assert is_hashed_password(hashed_password)
    assert not is_hashed_password(plain_password)


def test_get_password_hash():
    plain_password = "password"
    hashed_password = get_password_hash(plain_password)
    assert pwd_context.verify(plain_password, hashed_password)


def test_create_access_token():
    subject = "test_subject"
    scopes = ["test_scope1", "test_scope2"]
    access_token = create_access_token(subject=subject, scopes=scopes)
    decoded_token = jwt.decode(
        access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
    )
    assert decoded_token["sub"] == subject
    assert decoded_token["scopes"] == scopes
    assert "iat" in decoded_token
    assert "exp" in decoded_token
    assert decoded_token["token_type"] == "access_token"
    assert datetime.fromtimestamp(decoded_token["exp"]) - datetime.fromtimestamp(
        decoded_token["iat"]
    ) == timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
