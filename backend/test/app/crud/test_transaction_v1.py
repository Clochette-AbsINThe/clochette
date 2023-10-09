import datetime
from test.base_test import BaseTest
from unittest.mock import patch

from app.core.types import IconName, PaymentMethod, TransactionTypeV1
from app.crud.crud_consumable import consumable as crud_consumable
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.crud.crud_out_of_stock import out_of_stock as crud_out_of_stock
from app.crud.crud_out_of_stock_item import out_of_stock_item as crud_out_of_stock_item
from app.crud.crud_transaction_v1 import transaction as crud_transaction_v1
from app.dependencies import get_db
from app.schemas.consumable import ConsumableCreate
from app.schemas.consumable_item import ConsumableItem, ConsumableItemCreate
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStockCreate
from app.schemas.out_of_stock_item import OutOfStockItem, OutOfStockItemCreate
from app.schemas.transaction import TransactionFrontCreate


class TestCRUDTransactionV1(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        async with get_db.get_session() as session:
            consumable_item = ConsumableItemCreate(
                name="test_name",
                icon=IconName.MISC,
            )
            consumable_item_in_db = ConsumableItem.model_validate(
                await crud_consumable_item.create(session, obj_in=consumable_item)
            )
            consumable = ConsumableCreate(
                fkId=consumable_item_in_db.id,
                unitPrice=1,
                sell_price=1,
            )
            out_of_stock_item = OutOfStockItemCreate(
                name="test_name", icon=IconName.MISC
            )
            out_of_stock_item_in_db = OutOfStockItem.model_validate(
                await crud_out_of_stock_item.create(session, obj_in=out_of_stock_item)
            )
            out_of_stock = OutOfStockCreate(
                fkId=out_of_stock_item_in_db.id,
                unit_price=1,
            )

        self.item_consumable = Item(
            table="consumable",
            quantity=1,
            item=consumable,
        )
        self.item_out_of_stock = Item(
            table="out_of_stock",
            quantity=1,
            item=out_of_stock,
        )

    async def test_create_transaction_sale_false(self):
        with patch(
            "app.crud.crud_transaction_v1.treasuries.add_transaction"
        ) as mock_add_transaction:
            # Make mock_add_transaction awaitable
            mock_add_transaction.return_value = None

            # Arrange
            transaction_create = TransactionFrontCreate(
                amount=10,
                type=TransactionTypeV1.TRANSACTION,
                datetime=datetime.datetime.now(),
                payment_method=PaymentMethod.CARD,
                sale=False,
                items=[
                    self.item_consumable,
                    self.item_out_of_stock,
                ],
            )
            # Act
            async with get_db.get_session() as session:
                transaction_in_db = await crud_transaction_v1.create(
                    session, obj_in=transaction_create
                )

                consumable_in_db = await crud_consumable.query(session)
                out_of_stock_in_db = await crud_out_of_stock.query(session)

            # Assert
            assert (
                consumable_in_db[0].transaction_v1_id_purchase == transaction_in_db.id
            )
            assert consumable_in_db[0].transaction_v1_id_sale is None
            assert consumable_in_db[0].solded is False

            assert out_of_stock_in_db[0].transaction_v1_id == transaction_in_db.id

            assert mock_add_transaction.called

    async def test_create_transaction_sale_true(self):
        with patch(
            "app.crud.crud_transaction_v1.treasuries.add_transaction"
        ) as mock_add_transaction:
            # Make mock_add_transaction awaitable
            mock_add_transaction.return_value = None

            # Arrange
            transaction_create_consumable = TransactionFrontCreate(
                amount=10,
                type=TransactionTypeV1.TRANSACTION,
                datetime=datetime.datetime.now(),
                payment_method=PaymentMethod.CARD,
                sale=False,
                items=[self.item_consumable],
            )
            # Act
            async with get_db.get_session() as session:
                transaction_in_db_1 = await crud_transaction_v1.create(
                    session, obj_in=transaction_create_consumable
                )

                consumable_in_db = await crud_consumable.query(session)
                item_consumable_purchase = self.item_consumable
                item_consumable_purchase.computed_item.id = consumable_in_db[0].id
                transaction_create = TransactionFrontCreate(
                    amount=10,
                    type=TransactionTypeV1.TRANSACTION,
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    sale=True,
                    items=[
                        item_consumable_purchase,
                        self.item_out_of_stock,
                    ],
                )

                transaction_in_db_2 = await crud_transaction_v1.create(
                    session, obj_in=transaction_create
                )

                consumable_in_db = await crud_consumable.query(session)
                out_of_stock_in_db = await crud_out_of_stock.query(session)

            # Assert
            assert (
                consumable_in_db[0].transaction_v1_id_purchase == transaction_in_db_1.id
            )
            assert consumable_in_db[0].transaction_v1_id_sale == transaction_in_db_2.id
            assert consumable_in_db[0].solded is True

            assert out_of_stock_in_db[0].transaction_v1_id == transaction_in_db_2.id

            assert mock_add_transaction.called
