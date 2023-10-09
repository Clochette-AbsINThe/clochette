import datetime
from test.base_test import BaseTest
from unittest.mock import patch

from fastapi import HTTPException, status

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.crud.crud_barrel import barrel as crud_barrel
from app.dependencies import get_db
from app.models.barrel import Barrel
from app.models.transaction import Transaction
from app.schemas.v2.barrel import BarrelCreate, BarrelUpdateSale


class CRUDBarrelTest(BaseTest):
    def create_barrel_schema(self, transaction_id: int) -> BarrelCreate:
        return BarrelCreate(
            drink_item_id=0,
            sell_price=1,
            buy_price=1,
            transactionId=transaction_id,
        )

    def update_barrel_schema(self, transaction_id: int) -> BarrelUpdateSale:
        return BarrelUpdateSale(
            barrel_sell_price=1,
            transactionId=transaction_id,
        )

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_create_v2(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create_v2(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            assert isinstance(barrel, Barrel)

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_create_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.create_v2(
                    session,
                    obj_in=self.create_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_create_v2_transaction_not_pending(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.VALIDATED,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.create_v2(
                    session,
                    obj_in=self.create_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_create_v2_transaction_not_sale(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.create_v2(
                    session,
                    obj_in=self.create_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_create_v2_transaction_not_commerce(
        self, mock_read_transaction
    ) -> None:
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
                await crud_barrel.create_v2(
                    session,
                    obj_in=self.create_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_update_v2(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            barrel = await crud_barrel.update_v2(
                session,
                db_obj=barrel,
                obj_in=self.update_barrel_schema(1),
            )
            assert isinstance(barrel, Barrel)

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_update_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.update_v2(
                    session,
                    db_obj=barrel,
                    obj_in=self.update_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_update_v2_transaction_not_pending(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.VALIDATED,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.update_v2(
                    session,
                    db_obj=barrel,
                    obj_in=self.update_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_update_v2_transaction_not_sale(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.update_v2(
                    session,
                    db_obj=barrel,
                    obj_in=self.update_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_barrel.crud_transaction.read")
    async def test_update_v2_transaction_not_commerce(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.TRESORERY,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            barrel = await crud_barrel.create(
                session,
                obj_in=self.create_barrel_schema(1),
            )
            with self.assertRaises(HTTPException) as exception:
                await crud_barrel.update_v2(
                    session,
                    db_obj=barrel,
                    obj_in=self.update_barrel_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST
