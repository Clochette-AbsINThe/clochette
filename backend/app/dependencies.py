from typing import Generator

from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.auth import oauth2_scheme
from app.core.config import settings
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.db.session import SessionLocal
from app.models.account import Account
from app.schemas import token as token_schema


translator = Translator()


def get_db() -> Generator:
    """
    Get a database session.

    :return: A database session
    """
    # Create a database session
    db = SessionLocal()
    try:
        # Yield the session to the calling function
        yield db
    finally:
        # Close the session after it is no longer needed
        db.close()


def get_current_account(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> Account:
    """
    Get the current account associated with the JWT token in the authorization header.

    :param db: The database session (dependency injected)
    :param token: The JWT token in the authorization header (dependency injected)
    :return: The account associated with the JWT token if the token is valid
    """
    # Create an exception to be raised if the token is invalid (i.e. invalid credentials)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=translator.AUTHENTICATION_REQUIRED,
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token to get the payload
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Get the username from the payload
        username: str = payload.get("sub")
        if username is None:
            # Raise an exception if the username is not in the payload
            raise credentials_exception
        # Create a `TokenData`` object from the username
        token_data = token_schema.TokenData(username=username)
    except JWTError as e:
        # Raise an exception if the token cannot be decoded
        raise credentials_exception
    # Get the account associated with the username
    account = (accounts.query(db, limit=1, username=token_data.username)[0:1] or [None])[0]
    if account is None:
        # Raise an exception if the account does not exist
        raise credentials_exception
    # Return the account
    return account
