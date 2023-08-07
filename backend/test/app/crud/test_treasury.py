import datetime
from test.base_test import BaseTest

from fastapi import HTTPException

from app.core.types import PaymentMethod, TransactionType
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.transaction import TransactionCreate
from app.schemas.treasury import Treasury, TreasuryCreate


class TestCRUDTreasury(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        treasury = TreasuryCreate(cash_amount=0, total_amount=0, lydia_rate=0.015)

        async with get_db.get_session() as session:
            self.treasury_in_db = await crud_treasury.create(session, obj_in=treasury)

        self.transaction = TransactionCreate(
            amount=10,
            type=TransactionType.TRANSACTION,
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            sale=False,
        )

    async def test_add_transaction_no_treasury(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_treasury.delete(session, id=self.treasury_in_db.id)

        # Act
        with self.assertRaises(HTTPException):
            async with get_db.get_session() as session:
                await crud_treasury.add_transaction(session, obj_in=self.transaction)

    async def test_add_transaction_lydia_sale(self):
        # Arrange
        self.transaction.payment_method = PaymentMethod.LYDIA
        self.transaction.sale = True

        # Act
        async with get_db.get_session() as session:
            await crud_treasury.add_transaction(session, obj_in=self.transaction)

            treasury_in_db = Treasury.model_validate(
                await crud_treasury.read(session, id=self.treasury_in_db.id)
            )

        # Assert
        assert treasury_in_db.cash_amount == 0
        assert treasury_in_db.total_amount == 9.85

    async def test_add_transaction_cash_sale(self):
        # Arrange
        self.transaction.payment_method = PaymentMethod.CASH
        self.transaction.sale = True

        # Act
        async with get_db.get_session() as session:
            await crud_treasury.add_transaction(session, obj_in=self.transaction)

            treasury_in_db = Treasury.model_validate(
                await crud_treasury.read(session, id=self.treasury_in_db.id)
            )

        # Assert
        assert treasury_in_db.cash_amount == 10
        assert treasury_in_db.total_amount == 10

    async def test_add_transaction_cash_purchase(self):
        # Arrange
        self.transaction.payment_method = PaymentMethod.CASH
        self.transaction.sale = False

        # Act
        with self.assertRaises(HTTPException):
            async with get_db.get_session() as session:
                await crud_treasury.add_transaction(session, obj_in=self.transaction)
