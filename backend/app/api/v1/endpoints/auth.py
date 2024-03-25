import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, verify_password
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.dependencies import DBDependency, get_current_active_account
from app.schemas import account as account_schema
from app.schemas import token as token_schema

router = APIRouter(tags=["auth"], prefix="/auth")
translator = Translator(element="auth")

logger = logging.getLogger("app.api.v1.auth")


@router.post("/login/", response_model=token_schema.Token)
async def login(db: DBDependency, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Logs in a user and returns an access token.
    """
    account = ((await accounts.query(db, username=form_data.username, limit=1))[0:1] or [None])[0]
    # Check if account exists, if password is correct and if account is active
    if not account or not verify_password(form_data.password, account.password) or account.is_active is False:
        if not account:
            logger.debug("Account %s not found", form_data.username)
        elif not verify_password(form_data.password, account.password):
            logger.debug("Invalid password for %s", form_data.username)
        elif account.is_active is False:
            logger.debug("Account %s is not active", form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=translator.INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": create_access_token(subject=account.id, scopes=[account.scope.value])}


@router.get("/me/", response_model=account_schema.Account)
async def read_account_me(current_account: account_schema.Account = Security(get_current_active_account)):
    """
    Returns the current user's account information.
    """
    return current_account


@router.put("/me/", response_model=account_schema.Account)
async def update_account_me(
    account_in: account_schema.OwnAccountUpdate,
    db: DBDependency,
    current_account: account_schema.Account = Security(get_current_active_account),
):
    """
    Updates the current user's account information.
    """
    # Check if username is already taken
    if (
        account_in.username
        and account_in.username != current_account.username
        and await accounts.query(db, username=account_in.username)
    ):
        logger.debug("Username %s already exists", account_in.username)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=translator.USERNAME_UNAVAILABLE)

    old_account = (await accounts.query(db, id=current_account.id, limit=1))[0]
    return await accounts.update(db, db_obj=old_account, obj_in=account_in)
