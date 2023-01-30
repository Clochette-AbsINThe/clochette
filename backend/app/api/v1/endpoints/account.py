from fastapi import APIRouter, Depends, Security, HTTPException, status
from typing import Any

from app.core.translation import Translator
from app.core.utils.misc import to_query_parameters
from app.crud.crud_account import account as accounts
from app.dependencies import get_current_active_account, get_db
from app.schemas import account as account_schema


router = APIRouter(tags=["account"])
translator = Translator(element="account")


@router.get("/", response_model=list[account_schema.Account], dependencies=[Security(get_current_active_account, scopes=['president'])])
async def read_accounts(db=Depends(get_db), query=Depends(to_query_parameters(account_schema.AccountBase))) -> list:
    return await accounts.query(db, limit=None, **query.dict(exclude_none=True, exclude_unset=True))


@router.post("/", response_model=account_schema.Account)
async def create_account(account: account_schema.AccountCreate, db=Depends(get_db)) -> dict:
    if await accounts.query(db, username=account.username, limit=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return await accounts.create(db, obj_in=account)


@router.get("/{account_id}", response_model=account_schema.Account, dependencies=[Security(get_current_active_account, scopes=['president'])])
async def read_account(account_id: int, db=Depends(get_db)) -> Any:
    account = await accounts.read(db, account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return account


@router.put("/{account_id}", response_model=account_schema.Account, dependencies=[Security(get_current_active_account, scopes=['president'])])
async def update_account(account_id: int, account: account_schema.AccountUpdate, db=Depends(get_db)):
    old_account = await accounts.read(db, account_id)
    if old_account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    results = await accounts.query(db, username=account.username, limit=None)
    if results and results[0].id != old_account.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ELEMENT_ALREADY_EXISTS
        )
    return await accounts.update(db, db_obj=old_account, obj_in=account)


@router.delete("/{account_id}", response_model=account_schema.Account, dependencies=[Security(get_current_active_account, scopes=['president'])])
async def delete_account(account_id: int, db=Depends(get_db)) -> Any:
    account = await accounts.read(db, account_id)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return await accounts.delete(db, id=account_id)