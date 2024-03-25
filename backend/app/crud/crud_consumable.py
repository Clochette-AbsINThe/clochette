import logging

from fastapi import HTTPException, status

from app.core.translation import Translator
from app.core.types import Status, TradeType, TransactionType
from app.crud.base import CRUDBase
from app.crud.crud_transaction import transaction as crud_transaction
from app.models.consumable import Consumable
from app.schemas import consumable as consumable_schemas_v1
from app.schemas.v2 import consumable as consumable_schemas_v2

transaction_translator = Translator(element="transaction")

ConsumableCreate = consumable_schemas_v1.ConsumableCreate | consumable_schemas_v2.ConsumableCreate
ConsumableUpdate = consumable_schemas_v1.ConsumableUpdate | consumable_schemas_v2.ConsumableUpdate

logger = logging.getLogger("app.crud.crud_consumable")


class CRUDConsumable(CRUDBase[Consumable, ConsumableCreate, ConsumableUpdate]):
    async def create_v2(
        self,
        db,
        *,
        obj_in: consumable_schemas_v2.ConsumableCreate,
    ) -> Consumable:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id_purchase)
        if not transaction:
            logger.debug("Transaction %s not found", obj_in.transaction_id_purchase)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug("Transaction %s not pending", obj_in.transaction_id_purchase)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.trade != TradeType.PURCHASE:
            logger.debug("Transaction %s not purchase", obj_in.transaction_id_purchase)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PURCHASE,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug("Transaction %s not commerce", obj_in.transaction_id_purchase)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )
        return await super().create(db, obj_in=obj_in)

    async def update_v2(
        self,
        db,
        *,
        db_obj: Consumable,
        obj_in: consumable_schemas_v2.ConsumableUpdateSale,
    ) -> Consumable:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id_sale)
        if not transaction:
            logger.debug("Transaction %s not found", obj_in.transaction_id_sale)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug("Transaction %s not pending", obj_in.transaction_id_sale)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.trade != TradeType.SALE:
            logger.debug("Transaction %s not sale", obj_in.transaction_id_sale)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_SALE,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug("Transaction %s not commerce", obj_in.transaction_id_sale)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )

        return await super().update(db, db_obj=db_obj, obj_in=obj_in)


consumable = CRUDConsumable(Consumable)
