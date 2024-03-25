import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.utils.misc import process_query_parameters, to_query_parameters
from app.crud.crud_transaction_v1 import transaction as transactions
from app.dependencies import DBDependency, get_current_active_account
from app.schemas import transaction as transaction_schema

router = APIRouter(tags=["transaction"], prefix="/transaction", deprecated=True)
translator = Translator(element="transaction")

logger = logging.getLogger("app.api.v1.transaction")


@router.get(
    "/",
    response_model=list[transaction_schema.Transaction],
    dependencies=[Security(get_current_active_account)],
)
async def read_transactions(
    db: DBDependency,
    query=Depends(
        to_query_parameters(transaction_schema.TransactionBase, comparaison=True),
    ),
):
    query_parameters = process_query_parameters(query)
    logger.debug("Query parameters: %s", query_parameters)
    return await transactions.query(db, limit=None, **query_parameters)


@router.post(
    "/",
    response_model=transaction_schema.Transaction,
    dependencies=[Security(get_current_active_account)],
)
async def create_transaction(
    transaction: transaction_schema.TransactionFrontCreate,
    db: DBDependency,
):
    return await transactions.create(db, obj_in=transaction)


@router.get(
    "/{transaction_id}",
    response_model=transaction_schema.TransactionSingle,
    dependencies=[Security(get_current_active_account)],
)
async def read_transaction(transaction_id: int, db: DBDependency):
    transaction = await transactions.read(db, id=transaction_id)
    if transaction is None:
        logger.debug("Transaction %s not found", transaction_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return transaction
