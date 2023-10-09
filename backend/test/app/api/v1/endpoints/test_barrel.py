from test.base_test import BaseTest

from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_drink_item import drink_item as crud_drink
from app.dependencies import get_db
from app.schemas.barrel import Barrel, BarrelCreate, BarrelUpdate
from app.schemas.drink_item import DrinkItem, DrinkItemCreate


class TestBarrel(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.drink_create = DrinkItemCreate(name="test_name")

        async with get_db.get_session() as session:
            self.drink_db = DrinkItem.model_validate(
                await crud_drink.create(session, obj_in=self.drink_create)
            )
            self.barrel_create = BarrelCreate(
                fkId=self.drink_db.id,
                unitPrice=10,
                sell_price=2,
            )
            self.barrel_db = Barrel.model_validate(
                await crud_barrel.create(session, obj_in=self.barrel_create)
            )

        assert self.barrel_db.name == self.drink_create.name

    def test_read_barrels(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/barrel/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.barrel_db.model_dump(by_alias=True)]

    def test_read_barrels_all(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/barrel/?all=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.barrel_db.model_dump(by_alias=True)]

    def test_read_barrels_mounted(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/barrel/?mounted=True")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    async def test_read_distinct_barrels(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_barrel.create(session, obj_in=self.barrel_create)

        # Act
        response = self._client.get("/api/v1/barrel/distincts/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.barrel_db.model_dump(by_alias=True)]

    async def test_update_barrel(self):
        # Arrange
        barrel_update = BarrelUpdate(
            empty=True,
        )

        # Act
        response = self._client.put(
            f"/api/v1/barrel/{self.barrel_db.id}",
            json=barrel_update.model_dump(by_alias=True),
        )

        async with get_db.get_session() as session:
            barrel_in_db = Barrel.model_validate(
                await crud_barrel.read(session, id=self.barrel_db.id)
            )

        # Assert
        assert response.status_code == 200
        assert barrel_in_db.empty_or_solded == barrel_update.empty_or_solded
        assert response.json() == barrel_in_db.model_dump(by_alias=True)

    def test_update_barrel_not_found(self):
        # Arrange
        barrel_update = BarrelUpdate(
            empty=True,
        )

        # Act
        response = self._client.put(
            f"/api/v1/barrel/{self.barrel_db.id + 1}",
            json=barrel_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
