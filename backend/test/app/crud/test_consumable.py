import datetime
from test.base_test import BaseTest
from unittest.mock import patch

from fastapi import HTTPException, status

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.crud.crud_consumable import consumable as crud_consumable
from app.dependencies import get_db
from app.models.consumable import Consumable
from app.models.transaction import Transaction
from app.schemas.v2.consumable import ConsumableCreate, ConsumableUpdateSale


class CRUDConsumableTest(BaseTest):
    def create_consumable_schema(self, transaction_id: int) -> ConsumableCreate:
        return ConsumableCreate(
            consumable_item_id=0,
            sell_price=1,
            buy_price=1,
            transactionId=transaction_id,
        )

    def update_consumable_schema(self, transaction_id: int) -> ConsumableUpdateSale:
        return ConsumableUpdateSale(
            transactionId=transaction_id,
        )

    @patch("app.crud.crud_consumable.crud_transaction.read")
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
            consumable = await crud_consumable.create_v2(
                session,
                obj_in=self.create_consumable_schema(1),
            )
            assert isinstance(consumable, Consumable)

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_create_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.create_v2(
                    session,
                    obj_in=self.create_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_create_v2_transaction_not_pending(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.VALIDATED,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.create_v2(
                    session,
                    obj_in=self.create_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_create_v2_transaction_not_purchase(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.create_v2(
                    session,
                    obj_in=self.create_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_create_v2_transaction_not_commerce(
        self, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.TRESORERY,
            datetime=datetime.datetime.now(),
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.create_v2(
                    session,
                    obj_in=self.create_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_consumable.crud_transaction.read")
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
            consumable = await crud_consumable.create(
                session,
                obj_in=self.create_consumable_schema(1),
            )
            consumable = await crud_consumable.update_v2(
                session,
                db_obj=consumable,
                obj_in=self.update_consumable_schema(1),
            )
            assert isinstance(consumable, Consumable)

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_update_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.update_v2(
                    session,
                    db_obj=Consumable(
                        consumable_item_id=0,
                        sell_price=1,
                        buy_price=1,
                        transaction_id_purchase=1,
                    ),
                    obj_in=self.update_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_update_v2_transaction_not_pending(
        self, mock_read_transaction
    ) -> None:
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
                await crud_consumable.update_v2(
                    session,
                    db_obj=Consumable(
                        consumable_item_id=0,
                        sell_price=1,
                        buy_price=1,
                        transaction_id_purchase=1,
                    ),
                    obj_in=self.update_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_consumable.crud_transaction.read")
    async def test_update_v2_transaction_not_sale(self, mock_read_transaction) -> None:
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
                await crud_consumable.update_v2(
                    session,
                    db_obj=Consumable(
                        consumable_item_id=0,
                        sell_price=1,
                        buy_price=1,
                        transaction_id_purchase=1,
                    ),
                    obj_in=self.update_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_consumable.crud_transaction.read")
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
            with self.assertRaises(HTTPException) as exception:
                await crud_consumable.update_v2(
                    session,
                    db_obj=Consumable(
                        consumable_item_id=0,
                        sell_price=1,
                        buy_price=1,
                        transaction_id_purchase=1,
                    ),
                    obj_in=self.update_consumable_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST
