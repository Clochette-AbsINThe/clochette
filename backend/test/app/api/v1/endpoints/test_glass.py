from test.base_test import BaseTest

from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_drink import drink as crud_drink
from app.crud.crud_glass import glass as crud_glass
from app.dependencies import get_db
from app.schemas.barrel import Barrel, BarrelCreate
from app.schemas.drink import Drink, DrinkCreate
from app.schemas.glass import Glass, GlassCreate


class TestGlass(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.drink_create = DrinkCreate(name="test_name")

        async with get_db.get_session() as session:
            self.drink_db = Drink.model_validate(
                await crud_drink.create(session, obj_in=self.drink_create)
            )
            self.barrel_create = BarrelCreate(
                fkId=self.drink_db.id,
                unit_price=10,
                sell_price=2,
            )
            self.barrel_db = Barrel.model_validate(
                await crud_barrel.create(session, obj_in=self.barrel_create)
            )
            self.glass_create = GlassCreate(
                fkId=self.barrel_db.id,
            )
            self.glass_db = Glass.model_validate(
                await crud_glass.create(session, obj_in=self.glass_create)
            )

        assert self.glass_db.name == self.drink_create.name

    def test_read_glasses(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/glass/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.glass_db.model_dump(by_alias=True)]

    def test_read_glasses_query_barrel_id(self):
        # Arrange
        # Act
        response = self._client.get(
            f"/api/v1/glass/?barrel_id={self.glass_db.barrel_id}"
        )

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.glass_db.model_dump(by_alias=True)]

    def test_read_glasses_query_barrel_id_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/glass/?barrel_id=0")

        # Assert
        assert response.status_code == 200
        assert response.json() == []
