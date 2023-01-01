from typing import Generator

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import SecurityScopes
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


async def get_current_account(security_scopes: SecurityScopes, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> Account:
    """
    Get the current account associated with the JWT token in the authorization header.

    :param security_scopes: The security scopes
    :param db: The database session (dependency injected)
    :param token: The JWT token in the authorization header (dependency injected)

    :return: The account associated with the JWT token if the token is valid
    """
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope={security_scopes.scope_str}'
    else:
        authenticate_value = 'Bearer'
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
        # Get the scopes from the payload
        token_scopes = payload.get("scopes", [])
        # Create a `TokenData`` object from the username
        token_data = token_schema.TokenData(scopes=token_scopes, username=username)
    except JWTError as e:
        # Raise an exception if the token cannot be decoded
        raise credentials_exception
    # Get the account associated with the username
    account = (accounts.query(db, limit=1, username=token_data.username)[0:1] or [None])[0]
    if account is None:
        # Raise an exception if the account does not exist
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            # Raise an exception if the account does not have the required scope
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=translator.INSUFFICIENT_PERMISSIONS,
                headers={"WWW-Authenticate": authenticate_value},
            )
    # Return the account
    return account


async def get_current_active_account(current_account: Account = Security(get_current_account, scopes=['staff'])) -> Account:
    """
    Get the current active account associated with the JWT token in the authorization header.

    :param current_account: The account associated with the JWT token (dependency injected)

    :return: The account associated with the JWT token if the token is valid and the account is active
    """
    if not current_account.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.INACTIVE_ACCOUNT,
        )
    return current_account