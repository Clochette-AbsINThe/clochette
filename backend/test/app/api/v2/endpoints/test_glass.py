import datetime
from test.base_test import BaseTest

from app.core.types import PaymentMethod, TradeType
from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_drink_item import drink_item as crud_drink
from app.crud.crud_glass import glass as crud_glass
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.drink_item import DrinkItem, DrinkItemCreate
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.barrel import Barrel, BarrelCreate
from app.schemas.v2.glass import Glass, GlassCreate
from app.schemas.v2.transaction import TransactionCommerceCreate


class TestGlass(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.drink_create = DrinkItemCreate(name="test_name")

        async with get_db.get_session() as session:
            self.drink_db = DrinkItem.model_validate(await crud_drink.create(session, obj_in=self.drink_create))
            self.barrel_create = BarrelCreate(
                drink_item_id=self.drink_db.id,
                buy_price=10,
                sell_price=2,
                transactionId=0,
            )
            self.barrel_db = Barrel.model_validate(await crud_barrel.create(session, obj_in=self.barrel_create))
            self.glass_create = GlassCreate(
                barrel_id=self.barrel_db.id,
                transaction_id=0,
            )
            self.glass_db = Glass.model_validate(await crud_glass.create(session, obj_in=self.glass_create))
            await crud_treasury.create(
                session,
                obj_in=TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015),
            )

        assert self.glass_db.name == self.drink_create.name

    def test_read_glasses(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/glass/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.glass_db.model_dump(by_alias=True)]

    def test_read_glasses_query_barrel_id(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/glass/?barrel_id={self.glass_db.barrel_id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.glass_db.model_dump(by_alias=True)]

    def test_read_glasses_query_barrel_id_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/glass/?barrel_id=0")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    def test_read_glass(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/glass/{self.glass_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.glass_db.model_dump(by_alias=True)

    def test_read_glass_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/glass/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Glass not found"}

    async def test_create_glass(self):
        # Arrange
        async with get_db.get_session() as session:
            transaction = TransactionCommerceCreate(
                trade=TradeType.SALE,
                payment_method=PaymentMethod.CASH,
                datetime=datetime.datetime.now(),
            )
            transaction_db = await crud_transaction.create_v2(session, obj_in=transaction)

        glass_create = GlassCreate(
            barrel_id=self.barrel_db.id,
            transaction_id=transaction_db.id,
        )

        # Act
        response = self._client.post("/api/v2/glass/", json=glass_create.model_dump(by_alias=True))

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            glass_in_db = Glass.model_validate(await crud_glass.read(session, id=response.json()["id"]))
        assert response.json() == glass_in_db.model_dump(by_alias=True)
