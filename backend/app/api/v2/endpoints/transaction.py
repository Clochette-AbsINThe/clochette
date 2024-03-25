import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.core.types import SecurityScopes
from app.core.utils.misc import process_query_parameters
from app.crud.crud_transaction import transaction as transactions
from app.dependencies import DBDependency, get_current_active_account
from app.schemas.v2 import transaction as transaction_schema

router = APIRouter(tags=["transaction"], prefix="/transaction")
translator = Translator(element="transaction")

logger = logging.getLogger("app.api.v2.transaction")


@router.post(
    "/",
    response_model=transaction_schema.Transaction,
    dependencies=[Security(get_current_active_account)],
)
async def create_transaction(
    transaction: transaction_schema.TransactionCommerceCreate,
    db: DBDependency,
):
    """
    Create a new transaction in the database.
    """
    pending_transaction = await transactions.query(
        db,
        status=transaction_schema.Status.PENDING,
    )
    if pending_transaction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.ALREADY_PENDING_TRANSACTION,
        )
    return await transactions.create_v2(db, obj_in=transaction)


@router.post(
    "/treasury/",
    response_model=transaction_schema.Transaction,
    dependencies=[
        Security(get_current_active_account, scopes=[SecurityScopes.TREASURER.value]),
    ],
)
async def create_treasury_transaction(
    transaction: transaction_schema.TransactionTreasuryCreate,
    db: DBDependency,
):
    """
    Create a new transaction in the database.

    This endpoint requires authentication with the "treasury" scope.
    """
    return await transactions.create_treasury(db, obj_in=transaction)


@router.patch(
    "/{transaction_id}/validate",
    response_model=transaction_schema.Transaction,
    dependencies=[Security(get_current_active_account)],
)
async def validate_transaction(
    transaction_id: int,
    db: DBDependency,
):
    """
    Validate a transaction.
    """
    old_transaction = await transactions.read(db, id=transaction_id)
    if not old_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    if old_transaction.status != transaction_schema.Status.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.TRANSACTION_NOT_PENDING,
        )
    return await transactions.validate(
        db,
        db_obj=old_transaction,
        obj_in=transaction_schema.TransactionCommerceUpdate(),
    )


@router.delete(
    "/{transaction_id}",
    response_model=transaction_schema.TransactionDetail,
    dependencies=[
        Security(get_current_active_account, scopes=[SecurityScopes.TREASURER.value]),
    ],
)
async def delete_transaction(
    transaction_id: int,
    db: DBDependency,
):
    """
    Delete a transaction.

    This endpoint requires authentication with the "treasury" scope.
    """
    transaction = await transactions.read(db, id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return await transactions.delete(db, id=transaction_id)


@router.get(
    "/",
    response_model=list[transaction_schema.Transaction],
    dependencies=[Security(get_current_active_account)],
)
async def read_transactions(
    db: DBDependency,
    query=Depends(transaction_schema.TransactionQuery),
):
    """
    Retrieve transactions.
    """
    query_parameters = process_query_parameters(query)
    logger.debug("Query parameters: %s", query_parameters)
    return await transactions.query(db, limit=None, **query_parameters)


@router.get(
    "/{transaction_id}",
    response_model=transaction_schema.TransactionDetail,
    dependencies=[Security(get_current_active_account)],
)
async def read_transaction(
    transaction_id: int,
    db: DBDependency,
):
    """
    Retrieve a transaction.
    """
    transaction = await transactions.read(db, id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=translator.ELEMENT_NOT_FOUND,
        )
    return transaction
