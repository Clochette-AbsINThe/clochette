from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from app.core.security import create_access_token, verify_password
from app.core.translation import Translator
from app.crud.crud_account import account as accounts
from app.dependencies import get_current_account, get_db
from app.schemas import account as account_schema
from app.schemas import token as token_schema


router = APIRouter(tags=["auth"])
translator = Translator(element="auth")


@router.post("/login/", response_model=token_schema.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)) -> Any:
    account = (accounts.query(db, username=form_data.username, limit=1)[0:1] or [None])[0]
    if account is None or not verify_password(form_data.password, account.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=translator.INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {'access_token': create_access_token(subject=account.username)}


@router.get("/me/", response_model=account_schema.Account)
def read_account_me(current_account: account_schema.Account = Depends(get_current_account)) -> Any:
    return current_account