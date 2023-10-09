import logging

from fastapi import HTTPException, status

from app.core.translation import Translator
from app.core.types import Status, TradeType, TransactionType
from app.crud.base import CRUDBase
from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_transaction import transaction as crud_transaction
from app.models.glass import Glass
from app.schemas import glass as glass_schemas_v1
from app.schemas.v2 import glass as glass_schemas_v2

GlassCreate = glass_schemas_v1.GlassCreate | glass_schemas_v2.GlassCreate
GlassUpdate = glass_schemas_v1.GlassUpdate | glass_schemas_v2.GlassUpdate

transaction_translator = Translator(element="transaction")
barrel_translator = Translator(element="barrel")

logger = logging.getLogger("app.crud.crud_glass")


class CRUDGlass(CRUDBase[Glass, GlassCreate, GlassUpdate]):
    async def create_v2(self, db, *, obj_in: glass_schemas_v2.GlassCreate) -> Glass:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id)
        if not transaction:
            logger.debug(f"Transaction {obj_in.transaction_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug(f"Transaction {obj_in.transaction_id} not pending")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.trade != TradeType.SALE:
            logger.debug(f"Transaction {obj_in.transaction_id} not sale")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_SALE,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug(f"Transaction {obj_in.transaction_id} not commerce")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )

        barrel = await crud_barrel.read(db, id=obj_in.barrel_id)
        if not barrel:
            logger.debug(f"Barrel {obj_in.barrel_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=barrel_translator.ELEMENT_NOT_FOUND,
            )

        obj_in.transaction_sell_price = barrel.sell_price

        return await super().create(db, obj_in=obj_in)


glass = CRUDGlass(Glass)
