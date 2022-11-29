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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_account(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=translator.AUTHENTICATION_REQUIRED,
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = token_schema.TokenData(username=username)
    except JWTError as e:
        raise credentials_exception
    account = (accounts.query(db, limit=1, username=token_data.username)[0:1] or [None])[0]
    if account is None:
        raise credentials_exception
    return account
