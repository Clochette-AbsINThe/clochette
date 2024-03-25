from test.base_test import BaseTest

from app.core.types import IconName
from app.crud.crud_out_of_stock import out_of_stock as crud_out_of_stock
from app.crud.crud_out_of_stock_item import out_of_stock_item as crud_out_of_stock_item
from app.dependencies import get_db
from app.schemas.out_of_stock import OutOfStockCreate
from app.schemas.out_of_stock_item import (
    OutOfStockItem,
    OutOfStockItemCreate,
    OutOfStockItemUpdate,
)


class TestOutOfStockItem(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.out_of_stock_item_create = OutOfStockItemCreate(name="test_name", icon=IconName.MISC)

        async with get_db.get_session() as session:
            self.out_of_stock_item_db = OutOfStockItem.model_validate(
                await crud_out_of_stock_item.create(session, obj_in=self.out_of_stock_item_create)
            )

    async def read_out_of_stock_item_from_db(self, id: int) -> OutOfStockItem | None:
        async with get_db.get_session() as session:
            out_of_stock_item_in_db = await crud_out_of_stock_item.read(session, id)
            if out_of_stock_item_in_db is None:
                return None
            return OutOfStockItem.model_validate(out_of_stock_item_in_db)

    def test_read_out_of_stock_items_buy(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/out_of_stock_item/buy/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.out_of_stock_item_db.model_dump(by_alias=True)]

    async def test_read_out_of_stock_items_sell(self):
        # Arrange
        create_sell_item = OutOfStockItemCreate(name="test_name_sell", icon=IconName.MISC, sell_price=1)
        async with get_db.get_session() as session:
            out_of_stock_item_db = OutOfStockItem.model_validate(
                await crud_out_of_stock_item.create(session, obj_in=create_sell_item)
            )
        # Act
        response = self._client.get("/api/v1/out_of_stock_item/sell/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [out_of_stock_item_db.model_dump(by_alias=True)]

    def test_read_out_of_stock_item(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v1/out_of_stock_item/{self.out_of_stock_item_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.out_of_stock_item_db.model_dump(by_alias=True)

    def test_read_out_of_stock_item_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/out_of_stock_item/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Out of stock item not found"}

    async def test_create_out_of_stock_item(self):
        # Arrange
        out_of_stock_item_create = OutOfStockItemCreate(name="test_name2", icon=IconName.MISC)

        # Act
        response = self._client.post(
            "/api/v1/out_of_stock_item/",
            json=out_of_stock_item_create.model_dump(by_alias=True),
        )

        out_of_stock_item_in_db = await self.read_out_of_stock_item_from_db(response.json()["id"])

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == out_of_stock_item_create.name
        assert out_of_stock_item_in_db is not None
        assert out_of_stock_item_create.name == out_of_stock_item_in_db.name

    def test_create_out_of_stock_item_duplicate(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/out_of_stock_item/",
            json=self.out_of_stock_item_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Out of stock item already exists"}

    async def test_update_out_of_stock_item(self):
        # Arrange
        out_of_stock_item_update = OutOfStockItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            f"/api/v1/out_of_stock_item/{self.out_of_stock_item_db.id}",
            json=out_of_stock_item_update.model_dump(by_alias=True),
        )

        out_of_stock_item_in_db = await self.read_out_of_stock_item_from_db(self.out_of_stock_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == out_of_stock_item_update.name
        assert out_of_stock_item_in_db is not None
        assert out_of_stock_item_update.name == out_of_stock_item_in_db.name

    def test_update_out_of_stock_item_not_found(self):
        # Arrange
        out_of_stock_item_update = OutOfStockItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            "/api/v1/out_of_stock_item/0",
            json=out_of_stock_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Out of stock item not found"}

    async def test_update_out_of_stock_item_duplicate(self):
        # Arrange
        new_out_of_stock_item_create = OutOfStockItemCreate(name="test_name2", icon=IconName.MISC)

        async with get_db.get_session() as session:
            new_out_of_stock_item_db = OutOfStockItem.model_validate(
                await crud_out_of_stock_item.create(session, obj_in=new_out_of_stock_item_create)
            )
        out_of_stock_item_update = OutOfStockItemUpdate(name=new_out_of_stock_item_db.name)

        # Act
        response = self._client.put(
            f"/api/v1/out_of_stock_item/{self.out_of_stock_item_db.id}",
            json=out_of_stock_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Out of stock item already exists"}

    async def test_delete_out_of_stock_item(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v1/out_of_stock_item/{self.out_of_stock_item_db.id}")

        out_of_stock_item_in_db = await self.read_out_of_stock_item_from_db(self.out_of_stock_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json() == self.out_of_stock_item_db.model_dump(by_alias=True)
        assert out_of_stock_item_in_db is None

    def test_delete_out_of_stock_item_not_found(self):
        # Arrange
        # Act
        response = self._client.delete("/api/v1/out_of_stock_item/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Out of stock item not found"}

    async def test_delete_out_of_stock_item_in_use(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_out_of_stock.create(
                session,
                obj_in=OutOfStockCreate(
                    fkId=self.out_of_stock_item_db.id,
                    unit_price=1,
                ),
            )

        # Act
        response = self._client.delete(f"/api/v1/out_of_stock_item/{self.out_of_stock_item_db.id}")

        out_of_stock_item_in_db = await self.read_out_of_stock_item_from_db(self.out_of_stock_item_db.id)

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Out of stock item is in use and cannot be deleted"}
        assert out_of_stock_item_in_db is not None
