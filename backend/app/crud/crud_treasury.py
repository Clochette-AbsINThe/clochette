from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.decorator import synchronized
from app.core.translation import Translator
from app.core.types import PaymentMethod
from app.crud.base import CRUDBase
from app.models.treasury import Treasury
from app.schemas.transaction import TransactionCreate
from app.schemas.treasury import TreasuryCreate, TreasuryUpdate


translator = Translator(element="treasury")


class CRUDTreasury(CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate]):
    @synchronized
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
        treasury.total_amount += (
            (obj_in.amount * (1 - treasury.lydia_rate)) # Substract the lydia fee
            if obj_in.payment_method == PaymentMethod.lydia and obj_in.sale
            else (obj_in.amount if obj_in.sale else -obj_in.amount)
        )
        treasury.total_amount = round(treasury.total_amount, 2) # Cents are two decimals max

        if obj_in.payment_method == PaymentMethod.cash:
            treasury.cash_amount += obj_in.amount if obj_in.sale else -obj_in.amount
            treasury.cash_amount = round(treasury.cash_amount, 2) # Cents are two decimals max
            if treasury.cash_amount < 0: # If the cash amount is negative, raise a 400 error as it is not possible
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=translator.NEGATIVE_CASH_AMOUNT
                )

        # Update the treasury in the database and return it
        return await self.update(db, db_obj=treasury, obj_in=TreasuryUpdate.from_orm(treasury))


treasury = CRUDTreasury(Treasury)
