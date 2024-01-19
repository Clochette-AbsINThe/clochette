import logging

from fastapi import HTTPException, status

from app.core.translation import Translator
from app.core.types import Status, TradeType, TransactionType
from app.crud.base import CRUDBase
from app.crud.crud_transaction import transaction as crud_transaction
from app.models.barrel import Barrel
from app.schemas import barrel as barrel_schemas_v1
from app.schemas.v2 import barrel as barrel_schemas_v2

BarrelCreate = barrel_schemas_v1.BarrelCreate | barrel_schemas_v2.BarrelCreate
BarrelUpdate = barrel_schemas_v1.BarrelUpdate | barrel_schemas_v2.BarrelUpdate

transaction_translator = Translator(element="transaction")

logger = logging.getLogger("app.crud.crud_barrel")


class CRUDBarrel(CRUDBase[Barrel, BarrelCreate, BarrelUpdate]):
    async def create_v2(self, db, *, obj_in: barrel_schemas_v2.BarrelCreate) -> Barrel:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id_purchase)
        if not transaction:
            logger.debug(f"Transaction {obj_in.transaction_id_purchase} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug(f"Transaction {obj_in.transaction_id_purchase} not pending")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.trade != TradeType.PURCHASE:
            logger.debug(f"Transaction {obj_in.transaction_id_purchase} not purchase")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PURCHASE,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug(f"Transaction {obj_in.transaction_id_purchase} not commerce")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )

        return await super().create(db, obj_in=obj_in)

    async def update_v2(
        self, db, *, db_obj: Barrel, obj_in: barrel_schemas_v2.BarrelUpdateSale
    ) -> Barrel:
        transaction = await crud_transaction.read(db, id=obj_in.transaction_id_sale)
        if not transaction:
            logger.debug(f"Transaction {obj_in.transaction_id_sale} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=transaction_translator.ELEMENT_NOT_FOUND,
            )
        if transaction.status != Status.PENDING:
            logger.debug(f"Transaction {obj_in.transaction_id_sale} not pending")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_PENDING,
            )
        if transaction.trade != TradeType.SALE:
            logger.debug(f"Transaction {obj_in.transaction_id_sale} not sale")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_SALE,
            )
        if transaction.type != TransactionType.COMMERCE:
            logger.debug(f"Transaction {obj_in.transaction_id_sale} not commerce")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=transaction_translator.TRANSACTION_NOT_COMMERCE,
            )

        return await super().update(db, db_obj=db_obj, obj_in=obj_in)


barrel = CRUDBarrel(Barrel)
