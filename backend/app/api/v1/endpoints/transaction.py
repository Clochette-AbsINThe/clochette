from fastapi import APIRouter, Depends, HTTPException, status

from app.crud.crud_transaction import transaction as transactions
from app.dependencies import get_db
from app.schemas import transaction as transaction_schema


router = APIRouter()


@router.get("/", response_model=list[transaction_schema.Transaction])
async def read_transactions(db=Depends(get_db)) -> list[transaction_schema.Transaction]:
    return transactions.read_multi(db)


@router.post("/", response_model=transaction_schema.Transaction)
async def create_transaction(transaction: transaction_schema.TransactionFrontCreate, db=Depends(get_db)) -> dict:
    return transactions.create(db, obj_in=transaction)


@router.get("/{transaction_id}", response_model=transaction_schema.TransactionSingle)
async def read_transaction(transaction_id: int, db=Depends(get_db)) -> dict:
    transaction = transactions.read(db, id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return transaction


@router.delete("/{transaction_id}", response_model=transaction_schema.Transaction)
async def delete_transaction(transaction_id: int, db=Depends(get_db)) -> dict:
    if not transactions.read(db, id=transaction_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return transactions.delete(db, id=transaction_id)