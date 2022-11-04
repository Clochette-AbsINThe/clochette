from fastapi import APIRouter, Depends, HTTPException
from typing import Any

from app.crud.crud_transaction import transaction as transactions
from app.dependencies import get_db
from app.schemas import transaction as transaction_schema


router = APIRouter()


@router.get("/", response_model=list[transaction_schema.Transaction])
async def read_transactions(db=Depends(get_db)) -> list[transaction_schema.Transaction]:
    return transactions.read_multi(db)


@router.post("/", response_model=transaction_schema.Transaction)
async def create_transaction(transaction: transaction_schema.TransactionCreate, db=Depends(get_db)) -> dict:
    return transactions.create(db, obj_in=transaction)
