import logging

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import SecurityScopes
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import check_scopes, oauth2_scheme
from app.core.config import settings
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.db.select_db import select_db
from app.models.account import Account
from app.schemas import token as token_schema

translator = Translator()
logger = logging.getLogger("app.dependencies")


# Create a database session (dependency injected)
get_db = select_db()


async def get_current_account(
    security_scopes: SecurityScopes,
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> Account:
    """
    Get the current account associated with the JWT token in the authorization header.

    :param security_scopes: The security scopes
    :param db: The database session (dependency injected)
    :param token: The JWT token in the authorization header (dependency injected)

    :return: The account associated with the JWT token if the token is valid
    """
    authenticate_value = f"Bearer scope={security_scopes.scope_str}"

    # Create an exception to be raised if the token is invalid (i.e. invalid credentials)
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=translator.AUTHENTICATION_REQUIRED,
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token to get the payload
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Get the username from the payload
        username: str | None = payload.get("sub")
        if username is None:
            # Raise an exception if the username is not in the payload
            logger.debug("Username not in payload")
            raise credentials_exception

        # Get the scopes from the payload
        token_scopes = payload.get("scopes", [])
        # Create a `TokenData`` object from the username
        token_data = token_schema.TokenData(scopes=token_scopes, username=username)

    except JWTError:
        # Raise an exception if the token cannot be decoded
        logger.debug("Token could not be parsed")
        raise credentials_exception

    # Get the account associated with the username
    async with db as session:
        async with session.begin():
            account = (
                (await accounts.query(session, limit=1, username=token_data.username))
                or [None]
            )[0]

    if account is None:
        # Raise an exception if the account does not exist
        logger.debug("Account does not exist")
        raise credentials_exception

    if not token_scopes or not check_scopes(security_scopes, token_data.scopes):
        if not token_scopes:
            logger.debug("Token has no scopes")
        else:
            logger.debug("Token does not have the required scopes")
        # Raise an exception if the token does not have the required scope
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=translator.INSUFFICIENT_PERMISSIONS,
            headers={"WWW-Authenticate": authenticate_value},
        )
    # Return the account
    return account


async def get_current_active_account(
    current_account: Account = Security(get_current_account, scopes=["staff"])
) -> Account:
    """
    Get the current active account associated with the JWT token in the authorization header.

    :param current_account: The account associated with the JWT token (dependency injected)

    :return: The account associated with the JWT token if the token is valid and the account is active
    """
    if current_account.is_active is False:
        logger.debug("Account is inactive")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.INACTIVE_ACCOUNT,
        )
    return current_account
