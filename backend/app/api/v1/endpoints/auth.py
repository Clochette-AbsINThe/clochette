import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, verify_password
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.dependencies import get_current_active_account, get_db
from app.schemas import account as account_schema
from app.schemas import token as token_schema

router = APIRouter(tags=["auth"], prefix="/auth")
translator = Translator(element="auth")

logger = logging.getLogger("app.api.v1.auth")


@router.post("/login/", response_model=token_schema.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)
) -> Any:
    """
    Logs in a user and returns an access token.

    Args:
        form_data (OAuth2PasswordRequestForm): The user's login credentials.
        db (Database): The database session.

    Returns:
        dict: A dictionary containing the access token.
    """
    account = (
        (await accounts.query(db, username=form_data.username, limit=1))[0:1] or [None]
    )[0]
    # Check if account exists, if password is correct and if account is active
    if (
        account is None
        or not verify_password(form_data.password, account.password)
        or account.is_active is False
    ):
        if account is None:
            logger.debug(f"Account {form_data.username} not found")
        elif not verify_password(form_data.password, account.password):
            logger.debug(f"Invalid password for {form_data.username}")
        elif account.is_active is False:
            logger.debug(f"Account {form_data.username} is not active")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=translator.INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": create_access_token(
            subject=account.username, scopes=[account.scope.value]
        )
    }


@router.get("/me/", response_model=account_schema.Account)
async def read_account_me(
    current_account: account_schema.Account = Security(get_current_active_account),
) -> Any:
    """
    Returns the current user's account information.

    Args:
        current_account (Account): The current user's account.

    Returns:
        dict: A dictionary containing the user's account information.
    """
    return current_account


@router.put("/me/", response_model=account_schema.Account)
async def update_account_me(
    account_in: account_schema.OwnAccountUpdate,
    current_account: account_schema.Account = Security(get_current_active_account),
    db=Depends(get_db),
) -> Any:
    """
    Updates the current user's account information.

    Args:
        account_in (OwnAccountUpdate): The updated account information.
        current_account (Account): The current user's account.
        db (Database): The database session.

    Returns:
        dict: A dictionary containing the updated account information.
    """
    # Check if username is already taken
    if account_in.username and account_in.username != current_account.username:
        if await accounts.query(db, username=account_in.username):
            logger.debug(f"Username {account_in.username} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=translator.USERNAME_UNAVAILABLE,
            )
    account = await accounts.update(db, db_obj=current_account, obj_in=account_in)  # type: ignore
    return account
