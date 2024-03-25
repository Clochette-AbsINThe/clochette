import logging

from fastapi import HTTPException, status
from sqlalchemy import select
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
    CRUDBase[Treasury, TreasuryCreate, TreasuryUpdate | InternalTreasuryUpdate],
):
    async def add_transaction(
        self,
        db: AsyncSession,
        *,
        obj_in: TransactionCreate,
    ) -> Treasury:
        """
        Add a transaction to a treasury.

        :param db: The database session
        :param obj_in: The data for the transaction to be added.

        :return: The updated treasury.
        """
        # Get the treasury with the given id
        treasury_orm: Treasury | None = await self.read(
            db,
            obj_in.treasury_id,
            for_update=True,
        )
        # If the treasury does not exist, raise a 404 error
        if treasury_orm is None:
            logger.error("Treasury %s not found", obj_in.treasury_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=translator.ELEMENT_NOT_FOUND,
            )

        treasury_created = (
            await self.pre_authorize_transaction(
                treasury=treasury_orm,
                amount=obj_in.amount,
                sale=obj_in.sale,
                payment_method=obj_in.payment_method,
            )
        )[0]

        # Update the treasury in the database and return it
        return await self.update(
            db,
            db_obj=treasury_orm,
            obj_in=treasury_created,
        )

    async def pre_authorize_transaction(
        self,
        *,
        treasury: Treasury,
        amount: float,
        sale: bool,
        payment_method: PaymentMethod,
    ) -> tuple[InternalTreasuryUpdate, float]:
        """
        Pre-authorize a transaction to a treasury.

        :param db: The database session
        :param amount: The amount of the transaction to be pre-authorized.
        :param sale: Whether the transaction is a sale or a purchase.
        :param payment_method: The payment method of the transaction to be pre-authorized.

        :return: The updated treasury.
        """
        treasury_created = InternalTreasuryUpdate.model_validate(treasury)

        # Update the total amount of the treasury based on the transaction amount and whether it is a sale or a purchase
        real_amount: float = amount
        is_sale = sale
        is_lydia_payment = payment_method == PaymentMethod.LYDIA

        if is_lydia_payment and is_sale:
            # Subtract the Lydia fee
            real_amount *= 1 - treasury_created.lydia_rate
        elif not is_sale:
            real_amount *= -1

        real_amount = round(real_amount, 2)

        treasury_created.total_amount += real_amount
        # Cents are two decimals max
        treasury_created.total_amount = round(treasury_created.total_amount, 2)

        if payment_method == PaymentMethod.CASH:
            treasury_created.cash_amount += real_amount
            # Cents are two decimals max
            treasury_created.cash_amount = round(treasury_created.cash_amount, 2)

            if treasury_created.cash_amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=translator.NEGATIVE_CASH_AMOUNT,
                )

        return treasury_created, real_amount

    async def revert_transaction(
        self,
        *,
        treasury: Treasury,
        amount: float,
        payment_method: PaymentMethod,
    ) -> InternalTreasuryUpdate:
        """
        Revert a transaction to a treasury.

        If the transaction to revert was a sale we want to subtract the amount from the treasury.
        If the transaction to revert was a purchase we want to add the amount to the treasury.

        :param db: The database session
        :param amount: The amount of the transaction to be reverted
        :param sale: Whether the transaction is a sale or a purchase.
        :param payment_method: The payment method of the transaction to be reverted.

        :return: The updated treasury.
        """
        treasury_created = InternalTreasuryUpdate.model_validate(treasury)

        # Update the total amount of the treasury based on the transaction amount and whether it is a sale or a purchase
        treasury_created.total_amount -= amount

        # Cents are two decimals max
        treasury_created.total_amount = round(treasury_created.total_amount, 2)

        if payment_method == PaymentMethod.CASH:
            treasury_created.cash_amount -= amount
            # Cents are two decimals max
            treasury_created.cash_amount = round(treasury_created.cash_amount, 2)

            if treasury_created.cash_amount < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=translator.NEGATIVE_CASH_AMOUNT,
                )

        return treasury_created

    async def get_last_treasury(self, db: AsyncSession) -> Treasury:
        """
        Get the last treasury.

        :param db: The database session

        :return: The last treasury.
        """
        query = select(self.model).with_for_update(read=True).order_by(self.model.id.desc()).limit(1)
        result = await db.execute(query)
        treasuries = result.scalars().all()
        if not treasuries:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=translator.ELEMENT_NOT_FOUND,
            )
        return treasuries[0]


treasury = CRUDTreasury(Treasury)
