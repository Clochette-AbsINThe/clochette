import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.translation import Translator
from app.core.types import PaymentMethod, TradeType
from app.crud.base import CRUDBase
from app.crud.crud_treasury import treasury as crud_treasury
from app.models.transaction import Transaction
from app.schemas.treasury import InternalTreasuryUpdate
from app.schemas.v2.transaction import (
    TransactionCreate,
    TransactionTreasuryCreate,
    TransactionUpdate,
)

logger = logging.getLogger("app.crud.transaction")

translator = Translator()


class CRUDTransaction(CRUDBase[Transaction, TransactionCreate, TransactionUpdate]):
    async def create_v2(
        self,
        db: AsyncSession,
        *,
        obj_in: TransactionCreate,
    ) -> Transaction:
        """
        Create a transaction.

        :param db: The database session
        :param obj_in: The data for the transaction to be created

        :return: The created transaction
        """
        treasury_id = (await crud_treasury.get_last_treasury(db)).id
        obj_in.treasury_id = treasury_id
        return await super().create(db, obj_in=obj_in)

    async def create_treasury(
        self, db: AsyncSession, *, obj_in: TransactionTreasuryCreate
    ) -> Transaction:
        await self.update_treasury(
            db=db,
            amount=abs(obj_in.amount),
            payment_method=obj_in.payment_method,
            sale=obj_in.trade == TradeType.SALE,
        )
        return await self.create_v2(db, obj_in=obj_in)

    async def update_treasury(
        self,
        db: AsyncSession,
        *,
        amount: float,
        sale: bool,
        payment_method: PaymentMethod,
    ) -> tuple[InternalTreasuryUpdate, float]:
        """
        Update the treasury when a transaction is validated.
        """

        treasury = await crud_treasury.get_last_treasury(db)
        print(
            f"Total amount {treasury.total_amount} - Cash amount {treasury.cash_amount}"
        )
        # Pre-authorize the transaction
        tresury_update = await crud_treasury.pre_authorize_transaction(
            treasury=treasury,
            amount=amount,
            sale=sale,
            payment_method=payment_method,
        )
        # Update the treasury
        await crud_treasury.update(db, db_obj=treasury, obj_in=tresury_update[0])
        return tresury_update

    async def validate(
        self,
        db: AsyncSession,
        *,
        db_obj: Transaction,
        obj_in: TransactionUpdate,
    ) -> Transaction:
        """
        Validate a transaction.

        :param db: The database session
        :param id: The transaction id
        :param obj_in: The data for the transaction to be validated

        :return: The validated transaction
        """
        treasury_update = await self.update_treasury(
            db,
            amount=db_obj.price_sum,
            sale=db_obj.trade == TradeType.SALE,
            payment_method=db_obj.payment_method,
        )

        # Update the transaction
        obj_in.amount = treasury_update[1]
        logger.debug(f"Price sum: {obj_in.amount}")
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)

    async def delete(self, db: AsyncSession, *, id: int) -> Transaction | None:
        transaction_db = await super().delete(db, id=id)

        if transaction_db is not None:
            treasury = await crud_treasury.get_last_treasury(db)
            tresury_update = await crud_treasury.revert_transaction(
                treasury=treasury,
                amount=transaction_db.amount,
                payment_method=transaction_db.payment_method,
            )
            logger.debug(f"Treasury amount: {tresury_update.total_amount}")
            await crud_treasury.update(db, db_obj=treasury, obj_in=tresury_update)

        return transaction_db


transaction = CRUDTransaction(Transaction)
