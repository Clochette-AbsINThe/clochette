import datetime
from test.base_test import BaseTest
from unittest.mock import patch

from fastapi import HTTPException, status

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.crud.crud_non_inventoried import non_inventoried as crud_non_inventoried
from app.dependencies import get_db
from app.models.non_inventoried import NonInventoried
from app.models.non_inventoried_item import NonInventoriedItem
from app.models.transaction import Transaction
from app.schemas.v2.non_inventoried import NonInventoriedCreate


class CRUDNonInventoriedTest(BaseTest):
    def create_non_inventoried_schema(self, transaction_id: int, buy_price: int | None = None) -> NonInventoriedCreate:
        if buy_price is None:
            return NonInventoriedCreate(
                non_inventoried_item_id=0,
                transaction_id=transaction_id,
            )
        return NonInventoriedCreate(
            non_inventoried_item_id=0,
            buy_price=buy_price,
            transaction_id=transaction_id,
        )

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_purchase(self, mock_read_non_inventoried_item, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.PURCHASE,
        )
        async with get_db.get_session() as session:
            non_inventoried = await crud_non_inventoried.create_v2(
                session,
                obj_in=self.create_non_inventoried_schema(1, 1),
            )
            assert isinstance(non_inventoried, NonInventoried)

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_sale(self, mock_read_non_inventoried_item, mock_read_transaction) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.SALE,
            sell_price=1,
        )
        async with get_db.get_session() as session:
            non_inventoried = await crud_non_inventoried.create_v2(
                session,
                obj_in=self.create_non_inventoried_schema(1),
            )
            assert isinstance(non_inventoried, NonInventoried)
            assert non_inventoried.sell_price == 1

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    async def test_create_v2_transaction_not_found(self, mock_read_transaction) -> None:
        mock_read_transaction.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
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
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
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
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_non_inventoried_item_not_found(
        self, mock_read_non_inventoried_item, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = None
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_404_NOT_FOUND

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_sale_non_inventoried_item_not_sale(
        self, mock_read_non_inventoried_item, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.PURCHASE,
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_sale_non_inventoried_with_buy_price(
        self, mock_read_non_inventoried_item, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.SALE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.SALE,
            sell_price=1,
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1, 1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_purchase_non_inventoried_item_not_purchase(
        self, mock_read_non_inventoried_item, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.SALE,
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1, 1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST

    @patch("app.crud.crud_non_inventoried.crud_transaction.read")
    @patch("app.crud.crud_non_inventoried.crud_non_inventoried_item.read")
    async def test_create_v2_purchase_non_inventoried_not_buy_price(
        self, mock_read_non_inventoried_item, mock_read_transaction
    ) -> None:
        mock_read_transaction.return_value = Transaction(
            id=1,
            trade=TradeType.PURCHASE,
            payment_method=PaymentMethod.CARD,
            status=Status.PENDING,
            type=TransactionType.COMMERCE,
            datetime=datetime.datetime.now(),
        )
        mock_read_non_inventoried_item.return_value = NonInventoriedItem(
            id=1,
            trade=TradeType.PURCHASE,
        )
        async with get_db.get_session() as session:
            with self.assertRaises(HTTPException) as exception:
                await crud_non_inventoried.create_v2(
                    session,
                    obj_in=self.create_non_inventoried_schema(1),
                )
            assert exception.exception.status_code == status.HTTP_400_BAD_REQUEST
