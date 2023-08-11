import datetime
from test.base_test import BaseTest

from app.core.types import IconName, PaymentMethod, TransactionType
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.crud.crud_out_of_stock import out_of_stock as crud_out_of_stock
from app.crud.crud_out_of_stock_item import out_of_stock_item as crud_out_of_stock_item
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.consumable import ConsumableCreate
from app.schemas.consumable_item import ConsumableItem, ConsumableItemCreate
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStockCreate
from app.schemas.out_of_stock_item import OutOfStockItem, OutOfStockItemCreate
from app.schemas.transaction import (
    Transaction,
    TransactionFrontCreate,
    TransactionSingle,
)
from app.schemas.treasury import TreasuryCreate


class TestTransaction(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        async with get_db.get_session() as session:
            treasury = TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015)
            await crud_treasury.create(session, obj_in=treasury)
            consumable_item = ConsumableItemCreate(
                name="test_name",
                icon=IconName.MISC,
            )
            consumable_item_in_db = ConsumableItem.model_validate(
                await crud_consumable_item.create(session, obj_in=consumable_item)
            )
            consumable = ConsumableCreate(
                fkId=consumable_item_in_db.id,
                unit_price=1,
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

            transaction_create = TransactionFrontCreate(
                amount=10,
                type=TransactionType.TRANSACTION,
                datetime=datetime.datetime.now(),
                payment_method=PaymentMethod.CARD,
                sale=False,
                items=[
                    self.item_consumable,
                    self.item_out_of_stock,
                ],
            )

            self.transaction_in_db = await crud_transaction.create(
                session, obj_in=transaction_create
            )

            self.transaction = Transaction.model_validate(self.transaction_in_db)

    async def test_read_transactions(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/transaction/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [
            self.transaction.model_dump(
                by_alias=True, mode="json"
            )  # Mode json is used to convert value (like datetime) to strings
        ]

    async def test_create_transaction(self):
        # Arrange
        transaction_create = TransactionFrontCreate(
            amount=10,
            type=TransactionType.TRANSACTION,
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            sale=False,
            items=[
                self.item_out_of_stock,
            ],
        )

        # Act
        response = self._client.post(
            "/api/v1/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )
        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=response.json()["id"]
            )
            nb_out_of_stock_in_db = await crud_out_of_stock.query(session)

        # Assert
        assert response.status_code == 200
        assert transaction_in_db is not None
        assert response.json() == Transaction.model_validate(
            transaction_in_db
        ).model_dump(by_alias=True, mode="json")
        assert len(nb_out_of_stock_in_db) == 2

    async def test_read_transaction(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v1/transaction/{self.transaction.id}")

        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=self.transaction.id
            )

        # Assert
        assert response.status_code == 200
        assert response.json() == TransactionSingle.model_validate(
            transaction_in_db
        ).model_dump(by_alias=True, mode="json")

    async def test_read_transaction_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/transaction/0")

        # Assert
        assert response.status_code == 404
