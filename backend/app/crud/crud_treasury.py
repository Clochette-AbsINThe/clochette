from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.translation import Translator
from app.core.types import PaymentMethod
from app.crud.base import CRUDBase
from app.models.treasury import Treasury
from app.schemas.transaction import TransactionCreate
from app.schemas.treasury import TreasuryCreate, TreasuryUpdate


translator = Translator(element="treasury")


class CRUDTreasury(CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate]):
    async def add_transaction(self, db: AsyncSession, *, obj_in: TransactionCreate) -> Treasury:
        """
        Add a transaction to a treasury.

        :param db: The database session
        :param obj_in: The data for the transaction to be added.

        :return: The updated treasury.
        """
        # Get the treasury with the given id
        treasury: Treasury = await self.read(db, obj_in.treasury_id)
        # If the treasury does not exist, raise a 404 error
        if treasury is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=translator.ELEMENT_NOT_FOUND
            )
        # Update the total amount of the treasury based on the transaction amount and whether it is a sale or a purchase
        treasury.total_amount += obj_in.amount if obj_in.sale else -obj_in.amount
        # If the payment method is cash, update the cash amount of the treasury
        if obj_in.payment_method == PaymentMethod.cash:
            treasury.cash_amount += obj_in.amount if obj_in.sale else -obj_in.amount
            # Raise a 400 error if the cash amount of the treasury is negative (which is not possible)
            if treasury.cash_amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=translator.NEGATIVE_CASH_AMOUNT
                )
        # Update the treasury in the database and return it
        return await self.update(db, db_obj=treasury, obj_in=TreasuryUpdate.from_orm(treasury))


treasury = CRUDTreasury(Treasury)
