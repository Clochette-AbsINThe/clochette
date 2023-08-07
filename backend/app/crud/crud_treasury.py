import logging

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.translation import Translator
from app.core.types import PaymentMethod
from app.crud.base import CRUDBase
from app.models.treasury import Treasury
from app.schemas.transaction import TransactionCreate
from app.schemas.treasury import InternalTreasuryUpdate, TreasuryCreate, TreasuryUpdate

translator = Translator(element="treasury")

logger = logging.getLogger("app.crud.crud_treasury")


class CRUDTreasury(
    CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate | InternalTreasuryUpdate]
):
    async def add_transaction(
        self, db: AsyncSession, *, obj_in: TransactionCreate
    ) -> Treasury:
        """
        Add a transaction to a treasury.

        :param db: The database session
        :param obj_in: The data for the transaction to be added.

        :return: The updated treasury.
        """
        # Get the treasury with the given id
        treasury_orm: Treasury | None = await self.read(
            db, obj_in.treasury_id, for_update=True
        )
        # If the treasury does not exist, raise a 404 error
        if treasury_orm is None:
            logger.error(f"Treasury {obj_in.treasury_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=translator.ELEMENT_NOT_FOUND,
            )

        treasury_created = InternalTreasuryUpdate.model_validate(treasury_orm)

        # Update the total amount of the treasury based on the transaction amount and whether it is a sale or a purchase
        transaction_amount: float = obj_in.amount
        is_sale = obj_in.sale
        is_lydia_payment = obj_in.payment_method == PaymentMethod.LYDIA

        if is_lydia_payment and is_sale:
            # Subtract the Lydia fee
            transaction_amount *= 1 - treasury_created.lydia_rate

        # Add or subtract the transaction amount from the treasury's total amount
        if is_sale:
            treasury_created.total_amount += transaction_amount
        else:
            treasury_created.total_amount -= transaction_amount
        # Cents are two decimals max
        treasury_created.total_amount = round(treasury_created.total_amount, 2)

        if obj_in.payment_method == PaymentMethod.CASH:
            treasury_created.cash_amount += (
                obj_in.amount if obj_in.sale else -obj_in.amount
            )
            # Cents are two decimals max
            treasury_created.cash_amount = round(treasury_created.cash_amount, 2)
            if (
                treasury_created.cash_amount < 0
            ):  # If the cash amount is negative, raise a 400 error as it is not possible
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=translator.NEGATIVE_CASH_AMOUNT,
                )

        # Update the treasury in the database and return it
        return await self.update(
            db,
            db_obj=treasury_orm,
            obj_in=treasury_created,
        )


treasury = CRUDTreasury(Treasury)
