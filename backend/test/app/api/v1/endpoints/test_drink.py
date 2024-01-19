from test.base_test import BaseTest

from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_drink_item import drink_item as crud_drink
from app.dependencies import get_db
from app.schemas.barrel import BarrelCreate
from app.schemas.drink_item import DrinkItem, DrinkItemCreate, DrinkItemUpdate


class TestDrink(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.drink_create = DrinkItemCreate(name="test_name")

        async with get_db.get_session() as session:
            self.drink_db = DrinkItem.model_validate(
                await crud_drink.create(session, obj_in=self.drink_create)
            )

    async def read_drink_from_db(self, id: int) -> DrinkItem | None:
        async with get_db.get_session() as session:
            drink_in_db = await crud_drink.read(session, id)
            if drink_in_db is None:
                return None
            return DrinkItem.model_validate(drink_in_db)

    def test_read_drinks(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/drink/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.drink_db.model_dump(by_alias=True)]

    def test_read_drink(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v1/drink/{self.drink_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.drink_db.model_dump(by_alias=True)

    def test_read_drink_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/drink/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Drink not found"}

    async def test_create_drink(self):
        # Arrange
        drink_create = DrinkItemCreate(name="test_name2")

        # Act
        response = self._client.post(
            "/api/v1/drink/",
            json=drink_create.model_dump(by_alias=True),
        )

        drink_in_db = await self.read_drink_from_db(response.json()["id"])

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == drink_create.name
        assert drink_in_db is not None
        assert drink_create.name == drink_in_db.name

    def test_create_drink_duplicate(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/drink/",
            json=self.drink_create.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Drink already exists"}

    async def test_update_drink(self):
        # Arrange
        drink_update = DrinkItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            f"/api/v1/drink/{self.drink_db.id}",
            json=drink_update.model_dump(by_alias=True),
        )

        drink_in_db = await self.read_drink_from_db(self.drink_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("name") == drink_update.name
        assert drink_in_db is not None
        assert drink_update.name == drink_in_db.name

    def test_update_drink_not_found(self):
        # Arrange
        drink_update = DrinkItemUpdate(name="test_name2")

        # Act
        response = self._client.put(
            "/api/v1/drink/0",
            json=drink_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Drink not found"}

    async def test_update_drink_duplicate(self):
        # Arrange
        new_drink_create = DrinkItemCreate(name="test_name2")

        async with get_db.get_session() as session:
            new_drink_db = DrinkItem.model_validate(
                await crud_drink.create(session, obj_in=new_drink_create)
            )
        drink_update = DrinkItemUpdate(name=new_drink_db.name)

        # Act
        response = self._client.put(
            f"/api/v1/drink/{self.drink_db.id}",
            json=drink_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Drink already exists"}

    async def test_delete_drink(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v1/drink/{self.drink_db.id}")

        drink_in_db = await self.read_drink_from_db(self.drink_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json() == self.drink_db.model_dump(by_alias=True)
        assert drink_in_db is None

    def test_delete_drink_not_found(self):
        # Arrange
        # Act
        response = self._client.delete("/api/v1/drink/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Drink not found"}

    async def test_delete_drink_in_use(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_barrel.create(
                session,
                obj_in=BarrelCreate(
                    fkId=self.drink_db.id,
                    sell_price=1,
                    unitPrice=1,
                ),
            )

        # Act
        response = self._client.delete(f"/api/v1/drink/{self.drink_db.id}")

        drink_in_db = await self.read_drink_from_db(self.drink_db.id)

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Drink is in use and cannot be deleted"}
        assert drink_in_db is not None
