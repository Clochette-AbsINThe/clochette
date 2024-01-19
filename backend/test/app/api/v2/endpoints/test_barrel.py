import datetime
from test.base_test import BaseTest

from app.core.types import PaymentMethod, TradeType
from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_drink_item import drink_item as crud_drink
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.drink_item import DrinkItem, DrinkItemCreate
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.barrel import (
    Barrel,
    BarrelCreate,
    BarrelUpdateModify,
    BarrelUpdateSale,
)
from app.schemas.v2.transaction import TransactionCommerceCreate


class TestBarrel(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.drink_create = DrinkItemCreate(name="test_name")

        async with get_db.get_session() as session:
            self.drink_db = DrinkItem.model_validate(
                await crud_drink.create(session, obj_in=self.drink_create)
            )
            self.barrel_create = BarrelCreate(
                drink_item_id=self.drink_db.id,
                buy_price=10,
                sell_price=2,
                transactionId=0,
            )
            self.barrel_db = Barrel.model_validate(
                await crud_barrel.create(session, obj_in=self.barrel_create)
            )
            await crud_treasury.create(
                session,
                obj_in=TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015),
            )

        assert self.barrel_db.name == self.drink_create.name

    def test_read_barrels(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/barrel/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.barrel_db.model_dump(by_alias=True)]

    def test_read_barrels_all(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/barrel/?all=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.barrel_db.model_dump(by_alias=True)]

    def test_read_barrels_mounted(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/barrel/?is_mounted=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    def test_read_barrels_drink_item_id(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/barrel/?drink_item_id=10")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    async def test_read_distinct_barrels(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_barrel.create(session, obj_in=self.barrel_create)

        # Act
        response = self._client.get("/api/v2/barrel/distincts/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [
            {**self.barrel_db.model_dump(by_alias=True), "quantity": 2}
        ]

    async def test_read_distinct_barrels_mounted(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_barrel.create(session, obj_in=self.barrel_create)

        # Act
        response = self._client.get("/api/v2/barrel/distincts/?is_mounted=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    async def test_update_barrel(self):
        # Arrange
        barrel_update = BarrelUpdateModify(is_mounted=True)

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id}",
            json=barrel_update.model_dump(by_alias=True),
        )

        async with get_db.get_session() as session:
            barrel_in_db = Barrel.model_validate(
                await crud_barrel.read(session, id=self.barrel_db.id)
            )

        # Assert
        assert response.status_code == 200
        assert barrel_in_db.is_mounted == barrel_update.is_mounted
        assert response.json() == barrel_in_db.model_dump(by_alias=True)

    def test_update_barrel_not_found(self):
        # Arrange
        barrel_update = BarrelUpdateModify(is_mounted=True)

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id + 1}",
            json=barrel_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404

    def test_update_barrel_empty_or_solded(self):
        # Arrange
        self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id}",
            json=BarrelUpdateModify(empty_or_solded=True).model_dump(by_alias=True),
        )
        barrel_update = BarrelUpdateModify(sell_price=True)

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id}",
            json=barrel_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400

    async def test_create_barrel(self):
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

        barrel_create = BarrelCreate(
            drink_item_id=self.drink_db.id,
            buy_price=10,
            sell_price=2,
            transactionId=transaction_db.id,
        )

        # Act
        response = self._client.post(
            "/api/v2/barrel/", json=barrel_create.model_dump(by_alias=True)
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            barrel_in_db = Barrel.model_validate(
                await crud_barrel.read(session, id=response.json()["id"])
            )

        assert response.json() == barrel_in_db.model_dump(by_alias=True)

    async def test_sale_barrel(self):
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

            created_barrel = await crud_barrel.create(
                session,
                obj_in=BarrelCreate(
                    drink_item_id=self.drink_db.id,
                    buy_price=10,
                    sell_price=2,
                    transactionId=0,
                ),
            )

        barrel_sale = BarrelUpdateSale(
            barrel_sell_price=15,
            transactionId=transaction_db.id,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{created_barrel.id}/sale",
            json=barrel_sale.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            barrel_in_db = Barrel.model_validate(
                await crud_barrel.read(session, id=response.json()["id"])
            )
        assert response.json() == barrel_in_db.model_dump(by_alias=True)

    async def test_sale_barrel_not_found(self):
        # Arrange
        barrel_sale = BarrelUpdateSale(
            barrel_sell_price=15,
            transactionId=0,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id + 1}/sale",
            json=barrel_sale.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404

    async def test_sale_barrel_empty_or_solded(self):
        # Arrange
        self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id}",
            json=BarrelUpdateModify(empty_or_solded=True).model_dump(by_alias=True),
        )
        barrel_sale = BarrelUpdateSale(
            barrel_sell_price=15,
            transactionId=0,
        )

        # Act
        response = self._client.patch(
            f"/api/v2/barrel/{self.barrel_db.id}/sale",
            json=barrel_sale.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
