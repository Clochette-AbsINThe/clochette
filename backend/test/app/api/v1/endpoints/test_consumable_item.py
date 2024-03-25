from test.base_test import BaseTest

from app.core.types import IconName
from app.crud.crud_consumable import consumable as crud_consumable
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.dependencies import get_db
from app.schemas.consumable import ConsumableCreate
from app.schemas.consumable_item import (
    ConsumableItem,
    ConsumableItemCreate,
    ConsumableItemUpdate,
)


class TestConsumableItem(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.consumable_item_create = ConsumableItemCreate(name="test_name", icon=IconName.MISC)

        async with get_db.get_session() as session:
            self.consumable_item_db = ConsumableItem.model_validate(
                await crud_consumable_item.create(session, obj_in=self.consumable_item_create)
            )

    async def read_consumable_item_from_db(self, id: int) -> ConsumableItem | None:
        async with get_db.get_session() as session:
            consumable_item_in_db = await crud_consumable_item.read(session, id)
            if consumable_item_in_db is None:
                return None
            return ConsumableItem.model_validate(consumable_item_in_db)

    def test_read_consumable_items(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/consumable_item/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_item_db.model_dump(by_alias=True)]

    def test_read_consumable_item(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v1/consumable_item/{self.consumable_item_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.consumable_item_db.model_dump(by_alias=True)

    def test_read_consumable_item_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/consumable_item/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Consumable item not found"}

    async def test_create_consumable_item(self):
        # Arrange
        consumable_item_create = ConsumableItemCreate(name="test_name2", icon=IconName.MISC)

        # Act
        response = self._client.post(
            "/api/v1/consumable_item/",
            json=consumable_item_create.model_dump(by_alias=True),
        )

        consumable_item_in_db = await self.read_consumable_item_from_db(response.json()["id"])

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == consumable_item_create.name
        assert consumable_item_in_db is not None
        assert consumable_item_create.name == consumable_item_in_db.name

    def test_create_consumable_item_duplicate(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/consumable_item/",
            json=self.consumable_item_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Consumable item already exists"}

    async def test_update_consumable_item(self):
        # Arrange
        consumable_item_update = ConsumableItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            f"/api/v1/consumable_item/{self.consumable_item_db.id}",
            json=consumable_item_update.model_dump(by_alias=True),
        )

        consumable_item_in_db = await self.read_consumable_item_from_db(self.consumable_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == consumable_item_update.name
        assert consumable_item_in_db is not None
        assert consumable_item_update.name == consumable_item_in_db.name

    def test_update_consumable_item_not_found(self):
        # Arrange
        consumable_item_update = ConsumableItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            "/api/v1/consumable_item/0",
            json=consumable_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Consumable item not found"}

    async def test_update_consumable_item_duplicate(self):
        # Arrange
        new_consumable_item_create = ConsumableItemCreate(name="test_name2", icon=IconName.MISC)

        async with get_db.get_session() as session:
            new_consumable_item_db = ConsumableItem.model_validate(
                await crud_consumable_item.create(session, obj_in=new_consumable_item_create)
            )
        consumable_item_update = ConsumableItemUpdate(name=new_consumable_item_db.name)

        # Act
        response = self._client.put(
            f"/api/v1/consumable_item/{self.consumable_item_db.id}",
            json=consumable_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Consumable item already exists"}

    async def test_delete_consumable_item(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v1/consumable_item/{self.consumable_item_db.id}")

        consumable_item_in_db = await self.read_consumable_item_from_db(self.consumable_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json() == self.consumable_item_db.model_dump(by_alias=True)
        assert consumable_item_in_db is None

    def test_delete_consumable_item_not_found(self):
        # Arrange
        # Act
        response = self._client.delete("/api/v1/consumable_item/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Consumable item not found"}

    async def test_delete_consumable_item_in_use(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_consumable.create(
                session,
                obj_in=ConsumableCreate(
                    fkId=self.consumable_item_db.id,
                    sell_price=1,
                    unitPrice=1,
                ),
            )

        # Act
        response = self._client.delete(f"/api/v1/consumable_item/{self.consumable_item_db.id}")

        consumable_item_in_db = await self.read_consumable_item_from_db(self.consumable_item_db.id)

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Consumable item is in use and cannot be deleted"}
        assert consumable_item_in_db is not None
