import datetime
from test.base_test import BaseTest

from app.core.types import IconName, PaymentMethod, TradeType
from app.crud.crud_consumable import consumable as crud_consumable
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.consumable_item import ConsumableItem, ConsumableItemCreate
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.consumable import (
    Consumable,
    ConsumableCreate,
    ConsumableUpdateModify,
    ConsumableUpdateSale,
)
from app.schemas.v2.transaction import TransactionCommerceCreate


class TestConsumable(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.consumable_item_create = ConsumableItemCreate(
            name="test_name", icon=IconName.BEER
        )

        async with get_db.get_session() as session:
            self.consumable_item_db = ConsumableItem.model_validate(
                await crud_consumable_item.create(
                    session, obj_in=self.consumable_item_create
                )
            )
            self.consumable_create = ConsumableCreate(
                consumable_item_id=self.consumable_item_db.id,
                buy_price=10,
                sell_price=2,
                transactionId=0,
            )
            self.consumable_db = Consumable.model_validate(
                await crud_consumable.create(session, obj_in=self.consumable_create)
            )
            await crud_treasury.create(
                session,
                obj_in=TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015),
            )

        assert self.consumable_db.name == self.consumable_item_create.name

    def test_read_consumable(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/consumable/{self.consumable_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.consumable_db.model_dump(by_alias=True)

    def test_read_consumable_not_found(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/consumable/{self.consumable_db.id + 1}")

        # Assert
        assert response.status_code == 404

    def test_read_consumables(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/consumable/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    def test_read_consumables_all(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/consumable/?all=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    def test_read_consumables_consumable_item_id(self):
        # Arrange
        # Act
        response = self._client.get(
            f"/api/v2/consumable/?consumable_item_id={self.consumable_item_db.id}"
        )

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    async def test_read_distinct_consumables(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_consumable.create(session, obj_in=self.consumable_create)

        # Act
        response = self._client.get("/api/v2/consumable/distincts/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [
            {
                **self.consumable_db.model_dump(by_alias=True),
                "quantity": 2,
            }
        ]

    async def test_update_consumable(self):
        # Arrange
        consumable_update = ConsumableUpdateModify(
            sell_price=3,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}",
            json=consumable_update.model_dump(by_alias=True),
        )

        async with get_db.get_session() as session:
            consumable_in_db = Consumable.model_validate(
                await crud_consumable.read(session, id=self.consumable_db.id)
            )

        # Assert
        assert response.status_code == 200
        assert consumable_in_db.sell_price == consumable_update.sell_price
        assert response.json() == consumable_in_db.model_dump(by_alias=True)

    def test_update_consumable_not_found(self):
        # Arrange
        consumable_update = ConsumableUpdateModify(
            sell_price=3,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id + 1}",
            json=consumable_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404

    async def test_update_consumable_solded(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.SALE,
                payment_method=PaymentMethod.CARD,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(
                session, obj_in=transaction
            )
        self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}/sale",
            json=ConsumableUpdateSale(transactionId=transaction_db.id).model_dump(
                by_alias=True
            ),
        )
        consumable_update = ConsumableUpdateModify(sell_price=True)

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}",
            json=consumable_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400

    async def test_sale_consumable(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.SALE,
                payment_method=PaymentMethod.CARD,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(
                session, obj_in=transaction
            )
        consumable_update = ConsumableUpdateSale(
            transactionId=transaction_db.id,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}/sale",
            json=consumable_update.model_dump(by_alias=True),
        )

        async with get_db.get_session() as session:
            consumable_in_db = await crud_consumable.read(
                session, id=self.consumable_db.id
            )

        # Assert
        assert response.status_code == 200
        assert consumable_in_db is not None
        assert consumable_in_db.solded
        assert (
            consumable_in_db.transaction_id_sale
            == consumable_update.transaction_id_sale
        )
        assert response.json() == Consumable.model_validate(
            consumable_in_db
        ).model_dump(by_alias=True)

    async def test_sale_consumable_already_solded(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.SALE,
                payment_method=PaymentMethod.CARD,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(
                session, obj_in=transaction
            )
        self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}/sale",
            json=ConsumableUpdateSale(transactionId=transaction_db.id).model_dump(
                by_alias=True
            ),
        )
        consumable_update = ConsumableUpdateSale(
            transactionId=transaction_db.id,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id}/sale",
            json=consumable_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400

    def test_sale_consumable_not_found(self):
        # Arrange
        consumable_update = ConsumableUpdateSale(
            transactionId=0,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/consumable/{self.consumable_db.id + 1}/sale",
            json=consumable_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404

    async def test_create_consumable(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.PURCHASE,
                payment_method=PaymentMethod.CARD,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(
                session, obj_in=transaction
            )

        consumable_create = ConsumableCreate(
            consumable_item_id=self.consumable_item_db.id,
            buy_price=10,
            sell_price=2,
            transactionId=transaction_db.id,
        )

        # Act
        response = self._client.post(
            "/api/v2/consumable/",
            json=consumable_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            consumable_in_db = Consumable.model_validate(
                await crud_consumable.read(session, id=response.json()["id"])
            )
        assert consumable_in_db.name == self.consumable_item_create.name
        assert response.json() == consumable_in_db.model_dump(by_alias=True)
