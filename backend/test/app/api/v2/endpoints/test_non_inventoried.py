import datetime
from test.base_test import BaseTest

from app.core.types import IconName, PaymentMethod, TradeType
from app.crud.crud_non_inventoried import non_inventoried as crud_non_inventoried
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as crud_non_inventoried_item,
)
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.non_inventoried import NonInventoried, NonInventoriedCreate
from app.schemas.v2.non_inventoried_item import (
    NonInventoriedItem,
    NonInventoriedItemCreate,
)
from app.schemas.v2.transaction import TransactionCommerceCreate


class TestNonInventoried(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.non_inventoried_item_create = NonInventoriedItemCreate(name="test_name", icon=IconName.MISC)
        self.non_inventoried_item_sell_create = NonInventoriedItemCreate(
            name="test_name", icon=IconName.MISC, sell_price=2
        )

        async with get_db.get_session() as session:
            self.non_inventoried_item_db = NonInventoriedItem.model_validate(
                await crud_non_inventoried_item.create(session, obj_in=self.non_inventoried_item_create)
            )
            self.non_inventoried_item_sell_db = NonInventoriedItem.model_validate(
                await crud_non_inventoried_item.create(session, obj_in=self.non_inventoried_item_sell_create)
            )
            self.non_inventoried_create = NonInventoriedCreate(
                non_inventoried_item_id=self.non_inventoried_item_db.id,
                buy_price=10,
                transaction_id=0,
            )
            self.non_inventoried_db = NonInventoried.model_validate(
                await crud_non_inventoried.create(session, obj_in=self.non_inventoried_create)
            )
            await crud_treasury.create(
                session,
                obj_in=TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015),
            )

        assert self.non_inventoried_db.name == self.non_inventoried_item_create.name

    def test_read_non_inventorieds(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/non_inventoried/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [
            self.non_inventoried_db.model_dump(by_alias=True),
        ]

    def test_read_non_inventoried(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/non_inventoried/{self.non_inventoried_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.non_inventoried_db.model_dump(by_alias=True)

    def test_read_non_inventoried_not_found(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/non_inventoried/{self.non_inventoried_db.id+1}")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Non inventoried not found"}

    async def test_create_non_inventoried_buy(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.PURCHASE,
                payment_method=PaymentMethod.CASH,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(session, obj_in=transaction)

        non_inventoried_create = NonInventoriedCreate(
            non_inventoried_item_id=self.non_inventoried_item_db.id,
            buy_price=10,
            transaction_id=transaction_db.id,
        )

        # Act
        response = self._client.post(
            "/api/v2/non_inventoried/",
            json=non_inventoried_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            non_inventoried_in_db = NonInventoried.model_validate(
                await crud_non_inventoried.read(session, id=response.json()["id"])
            )
        assert response.json() == non_inventoried_in_db.model_dump(by_alias=True)

    async def test_create_non_inventoried_sell(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.SALE,
                payment_method=PaymentMethod.CASH,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(session, obj_in=transaction)

        non_inventoried_create = NonInventoriedCreate(
            non_inventoried_item_id=self.non_inventoried_item_sell_db.id,
            transaction_id=transaction_db.id,
        )

        # Act
        response = self._client.post(
            "/api/v2/non_inventoried/",
            json=non_inventoried_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            non_inventoried_in_db = NonInventoried.model_validate(
                await crud_non_inventoried.read(session, id=response.json()["id"])
            )
        assert response.json() == non_inventoried_in_db.model_dump(by_alias=True)
