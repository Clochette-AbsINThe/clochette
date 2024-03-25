from datetime import datetime, timedelta
from typing import MutableMapping

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# `JWTPayloadMapping` is a mutable mapping type (i.e. a key-value store like a dict)
# with string keys and values that can be any of the following types:
# datetime, bool, str, list of strings, or list of integers.
JWTPayloadMapping = MutableMapping[str, datetime | bool | str | list[str] | list[int]]

# `pwd_context` is a CryptContext instance that uses the bcrypt hashing algorithm
# and automatically handles deprecated hashing algorithms. It means that it will
# deprecate all supported schemes (except for the default one) and will automatically
# upgrade the hashes of deprecated schemes to the default one when verifying passwords.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    """
    Verify that the given plain password matches the given hashed password.

    :param plain_password: The plain password to be verified.
    :param hashed_password: The hashed password to be compared against.
    :return: True if the plain password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def is_hashed_password(password: str) -> bool:
    """
    Check if the given password is a hashed password in the bcrypt format.

    :param password: The password to be checked.
    :return: True if the given password is a hashed password, False otherwise.
    """
    return pwd_context.identify(password) == "bcrypt"


def get_password_hash(password: str) -> str:
    """
    Hash the given password using the default hashing algorithm (bcrypt).

    :param password: The password to be hashed.
    :return: The hashed password.
    """
    return pwd_context.hash(password)


def create_access_token(*, subject: int, scopes: list[str]) -> str:
    """
    Create an access token for the given subject (user ID).

    :param subject: The subject (username) for which the access token is being created.
    :return: The created access token.
    """
    return _create_token(
        subject=subject,
        scopes=scopes,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type="access_token",
    )


def _create_token(
    subject: int,
    scopes: list[str],
    expires_delta: timedelta,
    token_type: str,
) -> str:
    """
    Create a JWT token with the given subject, expiration delta, and token type.

    :param subject: The subject (user ID) for which the token is being created.
    :param expires_delta: The delta by which to calculate the expiration time of the token.
    :param token_type: The type of token being created (e.g. 'access_token', 'refresh_tocken').
    :return: The created JWT token.
    """
    to_encode: JWTPayloadMapping = {  # Following RFC 7519 for registered claims names
        "sub": str(subject),
        "scopes": scopes,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + expires_delta,
        "token_type": token_type,
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
