from test.base_test import BaseTest

from app.core.types import IconName, TradeType
from app.crud.crud_non_inventoried import non_inventoried as crud_non_inventoried
from app.crud.crud_non_inventoried_item import (
    non_inventoried_item as crud_non_inventoried_item,
)
from app.dependencies import get_db
from app.schemas.v2.non_inventoried import NonInventoriedCreate
from app.schemas.v2.non_inventoried_item import (
    NonInventoriedItem,
    NonInventoriedItemCreate,
    NonInventoriedItemUpdate,
)


class TestNonInventoriedItem(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.non_inventoried_item_create = NonInventoriedItemCreate(name="test_name", icon=IconName.MISC)

        async with get_db.get_session() as session:
            self.non_inventoried_item_db = NonInventoriedItem.model_validate(
                await crud_non_inventoried_item.create(session, obj_in=self.non_inventoried_item_create)
            )

    async def read_non_inventoried_item_from_db(self, id: int) -> NonInventoriedItem | None:
        async with get_db.get_session() as session:
            non_inventoried_item_in_db = await crud_non_inventoried_item.read(session, id)
            if non_inventoried_item_in_db is None:
                return None
            return NonInventoriedItem.model_validate(non_inventoried_item_in_db)

    def test_read_non_inventoried_items_purchase(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/non_inventoried_item?trade=purchase")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.non_inventoried_item_db.model_dump(by_alias=True)]

    async def test_read_non_inventoried_items_sale(self):
        # Arrange
        create_sell_item = NonInventoriedItemCreate(name="test_name_sell", icon=IconName.MISC, sell_price=1)
        async with get_db.get_session() as session:
            non_inventoried_item_db = NonInventoriedItem.model_validate(
                await crud_non_inventoried_item.create(session, obj_in=create_sell_item)
            )
        # Act
        response = self._client.get("/api/v2/non_inventoried_item?trade=sale")

        # Assert
        assert response.status_code == 200
        assert response.json() == [non_inventoried_item_db.model_dump(by_alias=True)]

    async def test_read_non_inventoried_item_query_name(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_non_inventoried_item.create(
                session,
                obj_in=NonInventoriedItemCreate(name="test_name_2", icon=IconName.MISC),
            )

        # Act
        response = self._client.get("/api/v2/non_inventoried_item?trade=purchase&name=test_name")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.non_inventoried_item_db.model_dump(by_alias=True)]

    async def test_read_non_inventoried_item(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.non_inventoried_item_db.model_dump(by_alias=True)

    async def test_read_non_inventoried_item_not_found(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id + 1}")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Non inventoried item not found"}

    async def test_create_non_inventoried_item_buy(self):
        # Arrange
        non_inventoried_item_create = NonInventoriedItemCreate(name="test_name2", icon=IconName.MISC)

        # Act
        response = self._client.post(
            "/api/v2/non_inventoried_item/",
            json=non_inventoried_item_create.model_dump(by_alias=True),
        )

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(response.json()["id"])

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == non_inventoried_item_create.name
        assert non_inventoried_item_in_db is not None
        assert non_inventoried_item_in_db.name == non_inventoried_item_create.name

    async def test_create_non_inventoried_item_sell(self):
        # Arrange
        non_inventoried_item_create = NonInventoriedItemCreate(name="test_name2", icon=IconName.MISC, sell_price=1)

        # Act
        response = self._client.post(
            "/api/v2/non_inventoried_item/",
            json=non_inventoried_item_create.model_dump(by_alias=True),
        )

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(response.json()["id"])

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == non_inventoried_item_create.name
        assert response.json().get("sellPrice") == non_inventoried_item_create.sell_price
        assert non_inventoried_item_in_db is not None
        assert non_inventoried_item_in_db.name == non_inventoried_item_create.name

    async def test_create_non_inventoried_item_duplicate(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v2/non_inventoried_item/",
            json=self.non_inventoried_item_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Non inventoried item already exists"}

    async def test_update_non_inventoried_item(self):
        # Arrange
        non_inventoried_item_update = NonInventoriedItemUpdate(name="test_name2")

        # Act
        response = self._client.patch(
            f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}",
            json=non_inventoried_item_update.model_dump(by_alias=True),
        )

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(self.non_inventoried_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == non_inventoried_item_update.name
        assert non_inventoried_item_in_db is not None
        assert non_inventoried_item_in_db.name == non_inventoried_item_update.name
        assert non_inventoried_item_in_db.trade == TradeType.PURCHASE

    async def test_update_non_inventoried_item_sell(self):
        # Arrange
        non_inventoried_item_update = NonInventoriedItemUpdate(sell_price=1)

        # Act
        response = self._client.patch(
            f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}",
            json=non_inventoried_item_update.model_dump(by_alias=True),
        )

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(self.non_inventoried_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("sellPrice") == non_inventoried_item_update.sell_price
        assert non_inventoried_item_in_db is not None
        assert non_inventoried_item_in_db.sell_price == non_inventoried_item_update.sell_price
        assert non_inventoried_item_in_db.trade == TradeType.SALE

    async def test_update_non_inventoried_item_not_found(self):
        # Arrange
        non_inventoried_item_update = NonInventoriedItemUpdate(name="test_name2")

        # Act
        response = self._client.patch(
            f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id + 1}",
            json=non_inventoried_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Non inventoried item not found"}

    async def test_update_non_inventoried_item_duplicate(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_non_inventoried_item.create(
                session,
                obj_in=NonInventoriedItemCreate(name="test_name_2", icon=IconName.MISC),
            )
        non_inventoried_item_update = NonInventoriedItemUpdate(name="test_name_2")

        # Act
        response = self._client.patch(
            f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}",
            json=non_inventoried_item_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Non inventoried item already exists"}

    async def test_delete_non_inventoried_item(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}")

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(self.non_inventoried_item_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json() == self.non_inventoried_item_db.model_dump(by_alias=True)
        assert non_inventoried_item_in_db is None

    async def test_delete_non_inventoried_item_not_found(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id + 1}")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Non inventoried item not found"}

    async def test_delete_non_inventoried_item_in_use(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_non_inventoried.create(
                session,
                obj_in=NonInventoriedCreate(
                    non_inventoried_item_id=self.non_inventoried_item_db.id,
                    buy_price=1,
                    transaction_id=0,
                ),
            )

        # Act
        response = self._client.delete(f"/api/v2/non_inventoried_item/{self.non_inventoried_item_db.id}")

        non_inventoried_item_in_db = await self.read_non_inventoried_item_from_db(self.non_inventoried_item_db.id)

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Non inventoried item is in use and cannot be deleted"}
        assert non_inventoried_item_in_db is not None
