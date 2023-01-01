from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.utils.misc import process_query_parameters, to_query_parameters
from app.crud.crud_transaction import transaction as transactions
from app.dependencies import get_current_active_account, get_db
from app.schemas import transaction as transaction_schema


router = APIRouter(tags=["transaction"])
translator = Translator(element="transaction")


@router.get("/", response_model=list[transaction_schema.Transaction], dependencies=[Security(get_current_active_account)])
async def read_transactions(db=Depends(get_db), query=Depends(to_query_parameters(transaction_schema.TransactionBase, comparison=True))) -> list[transaction_schema.Transaction]:
    print(process_query_parameters(query))
    return transactions.query(db, limit=None, **process_query_parameters(query))


@router.post("/", response_model=transaction_schema.Transaction, dependencies=[Security(get_current_active_account)])
async def create_transaction(transaction: transaction_schema.TransactionFrontCreate, db=Depends(get_db)) -> dict:
    return transactions.create(db, obj_in=transaction)


@router.get("/{transaction_id}", response_model=transaction_schema.TransactionSingle, response_model_exclude_none=True, dependencies=[Security(get_current_active_account, scopes=['treasurer'])])
async def read_transaction(transaction_id: int, db=Depends(get_db)) -> dict:
    transaction = transactions.read(db, id=transaction_id)
    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return transaction


@router.delete("/{transaction_id}", response_model=transaction_schema.Transaction, dependencies=[Security(get_current_active_account, scopes=['treasurer'])])
async def delete_transaction(transaction_id: int, db=Depends(get_db)) -> dict:
    if transactions.read(db, id=transaction_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND
        )
    return transactions.delete(db, id=transaction_id)