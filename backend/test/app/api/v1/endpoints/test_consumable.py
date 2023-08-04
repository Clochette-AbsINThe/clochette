from test.base_test import BaseTest

from app.core.types import IconName
from app.crud.crud_consumable import consumable as crud_consumable
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.dependencies import get_db
from app.schemas.consumable import Consumable, ConsumableCreate, ConsumableUpdate
from app.schemas.consumable_item import ConsumableItem, ConsumableItemCreate


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
                fkId=self.consumable_item_db.id,
                unit_price=10,
                sell_price=2,
            )
            self.consumable_db = Consumable.model_validate(
                await crud_consumable.create(session, obj_in=self.consumable_create)
            )

        assert self.consumable_db.name == self.consumable_item_create.name

    def test_read_consumables(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/consumable/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    def test_read_consumables_all(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/consumable/?all=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    async def test_read_distinct_consumables(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_consumable.create(session, obj_in=self.consumable_create)

        # Act
        response = self._client.get("/api/v1/consumable/distincts/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.consumable_db.model_dump(by_alias=True)]

    async def test_update_consumable(self):
        # Arrange
        consumable_update = ConsumableUpdate(
            sell_price=3,
        )

        # Act
        response = self._client.put(
            f"/api/v1/consumable/{self.consumable_db.id}",
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
        consumable_update = ConsumableUpdate(
            sell_price=3,
        )

        # Act
        response = self._client.put(
            f"/api/v1/consumable/{self.consumable_db.id + 1}",
            json=consumable_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
