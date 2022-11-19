from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from app.core.auth import authenticate, create_access_token
from app.crud.crud_account import account as accounts
from app.schemas import account as account_schema


router = APIRouter()


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    account = authenticate(username=form_data.username, password=form_data.password)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": create_access_token(subject=account.id),
        "token_type": "bearer",
    }