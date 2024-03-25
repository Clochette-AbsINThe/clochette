import logging

from fastapi import HTTPException, status

from app.core.translation import Translator
from app.core.types import Status, TradeType, TransactionType
from app.crud.base import CRUDBase
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as crud_non_inventoried_item,
)
from app.crud.crud_transaction import transaction as crud_transaction
from app.models.non_inventoried import NonInventoried
from app.schemas.v2.non_inventoried import NonInventoriedCreate, NonInventoriedUpdate

transaction_translator = Translator(element="transaction")
non_invendtoried_item_translator = Translator(element="non_inventoried_item")

logger = logging.getLogger("app.crud.crud_non_inventoried")


class CRUDNonInventoried(
    CRUDBase[NonInventoried, NonInventoriedCreate, NonInventoriedUpdate],
):
    async def create_v2(self, db, *, obj_in: NonInventoriedCreate) -> NonInventoried:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id)
        if not transaction:
            logger.debug("Transaction %s not found", obj_in.transaction_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug("Transaction %s not pending", obj_in.transaction_id)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug("Transaction %s not commerce", obj_in.transaction_id)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )

        non_inventoried_item = await crud_non_inventoried_item.read(
            db,
            id=obj_in.non_inventoried_item_id,
        )
        if not non_inventoried_item:
            logger.debug(
                "NonInventoriedItem %s not found",
                obj_in.non_inventoried_item_id,
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=non_invendtoried_item_translator.ELEMENT_NOT_FOUND,
            )

        if transaction.trade == TradeType.SALE:
            if non_inventoried_item.trade != TradeType.SALE:
                logger.debug(
                    "NonInventoriedItem %s not sale",
                    obj_in.non_inventoried_item_id,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=non_invendtoried_item_translator.INTEGRITY_ERROR,
                )
            if obj_in.buy_price is not None:
                logger.debug(
                    "NonInventoriedItem %s has buy price",
                    obj_in.non_inventoried_item_id,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=non_invendtoried_item_translator.INTEGRITY_ERROR,
                )
            obj_in.sell_price = non_inventoried_item.sell_price

        elif transaction.trade == TradeType.PURCHASE:
            if non_inventoried_item.trade != TradeType.PURCHASE:
                logger.debug(
                    "NonInventoriedItem %s not purchase",
                    obj_in.non_inventoried_item_id,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=non_invendtoried_item_translator.INTEGRITY_ERROR,
                )
            if obj_in.buy_price is None:
                logger.debug(
                    "NonInventoriedItem %s has no buy price",
                    obj_in.non_inventoried_item_id,
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=non_invendtoried_item_translator.INTEGRITY_ERROR,
                )
            obj_in.sell_price = None

        return await super().create(db, obj_in=obj_in)


non_inventoried = CRUDNonInventoried(NonInventoried)
