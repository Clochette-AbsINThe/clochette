import datetime
from test.base_test import BaseTest
from unittest.mock import patch

from fastapi import HTTPException, status

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.crud.crud_glass import glass as crud_glass
from app.dependencies import get_db
from app.models.barrel import Barrel
from app.models.glass import Glass
from app.models.transaction import Transaction
from app.schemas.v2.glass import GlassCreate


class CRUDGlassTest(BaseTest):
    def create_glass_schema(self, transaction_id: int) -> GlassCreate:
        return GlassCreate(
            barrel_id=0,
            transaction_id=transaction_id,
        )

    @patch("app.crud.crud_glass.crud_barrel.read")
    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2(self, mock_read_transaction, mock_read_barrel) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_barrel.return_value = Barrel(
            id=1,
            sell_price=1,
        )
        async with get_db.get_session() as session:
            glass = await crud_glass.create_v2(
                session,
                obj_in=self.create_glass_schema(1),
            )
            assert isinstance(glass, Glass)
            assert glass.transaction_sell_price == 1

    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_glass.create_v2(
                    session,
                    obj_in=self.create_glass_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2_transaction_not_pending(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.VALIDATED,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_glass.create_v2(
                    session,
                    obj_in=self.create_glass_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2_transaction_not_sale(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_glass.create_v2(
                    session,
                    obj_in=self.create_glass_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2_transaction_not_commerce(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.TRESORERY,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_glass.create_v2(
                    session,
                    obj_in=self.create_glass_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_glass.crud_barrel.read")
    @patch("app.crud.crud_glass.crud_transaction.read")
    async def test_create_v2_barrel_not_found(self, mock_read_transaction, mock_read_barrel) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_barrel.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_glass.create_v2(
                    session,
                    obj_in=self.create_glass_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND
