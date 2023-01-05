from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, Security, status
from typing import Any

from app.core.security import create_access_token, verify_password
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.dependencies import get_current_active_account, get_db
from app.schemas import account as account_schema
from app.schemas import token as token_schema


router = APIRouter(tags=["auth"])
translator = Translator(element="auth")


@router.post("/login/", response_model=token_schema.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)) -> Any:
    account = (accounts.query(db, username=form_data.username, limit=1)[0:1] or [None])[0]
    # Check if account exists, if password is correct and if account is active
    if account is None or not verify_password(form_data.password, account.password) or not account.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=translator.INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {'access_token': create_access_token(subject=account.username, scopes=[account.scope.value])}


@router.get("/me/", response_model=account_schema.Account)
def read_account_me(current_account: account_schema.Account = Security(get_current_active_account)) -> Any:
    return current_account

@router.put("/me/", response_model=account_schema.Account)
def update_account_me(account_in: account_schema.AccountUpdate, current_account: account_schema.Account = Security(get_current_active_account), db = Depends(get_db)) -> Any:
    # Check if username is already taken
    if account_in.username and account_in.username != current_account.username:
        if accounts.query(db, username=account_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=translator.USERNAME_UNAVAILABLE,
            )
    account = accounts.update(db, db_obj=current_account, obj_in=account_in)
    return account