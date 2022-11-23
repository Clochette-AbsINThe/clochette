from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any

from app.core.security import get_password_hash
from app.crud.crud_account import account as accounts
from app.dependencies import get_current_account, get_db
from app.schemas import account as account_schema


router = APIRouter()


@router.get("/", response_model=list[account_schema.Account], dependencies=[Depends(get_current_account)])
async def read_accounts(db=Depends(get_db)) -> list:
    return accounts.query(db)


@router.post("/", response_model=account_schema.Account, dependencies=[Depends(get_current_account)])
async def create_account(account: account_schema.AccountCreate, db=Depends(get_db)) -> dict:
    if accounts.query(db, username=account.username, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already exists"
        )
    account.password = get_password_hash(account.password)
    return accounts.create(db, obj_in=account)


@router.get("/{account_id}", response_model=account_schema.Account, dependencies=[Depends(get_current_account)])
async def read_account(account_id: int, db=Depends(get_db)) -> Any:
    account = accounts.read(db, account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    return account


@router.put("/{account_id}", response_model=account_schema.Account, dependencies=[Depends(get_current_account)])
async def update_account(account_id: int, account: account_schema.AccountUpdate, db=Depends(get_db)):
    old_account = accounts.read(db, account_id)
    if old_account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    results = accounts.query(db, username=account.username, limit=None)
    if results and results[0].id != old_account.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account already exists"
        )
    account.password = get_password_hash(account.password)
    return accounts.update(db, db_obj=old_account, obj_in=account)


@router.delete("/{account_id}", response_model=account_schema.Account, dependencies=[Depends(get_current_account)])
async def delete_account(account_id: int, db=Depends(get_db)) -> Any:
    account = accounts.read(db, account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    return accounts.delete(db, account_id)