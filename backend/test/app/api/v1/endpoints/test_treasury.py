from test.base_test import BaseTest

from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.treasury import Treasury, TreasuryCreate, TreasuryUpdate


class TreasuryTest(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.treasury_create = TreasuryCreate(
            total_amount=0,
            cash_amount=0,
            lydia_rate=0.015,
        )

        async with get_db.get_session() as session:
            self.treasury_db = Treasury.model_validate(await crud_treasury.create(session, obj_in=self.treasury_create))

    async def read_treasury_from_db(self, id: int) -> Treasury | None:
        async with get_db.get_session() as session:
            treasury_in_db = await crud_treasury.read(session, id)
            if treasury_in_db is None:
                return None
            return Treasury.model_validate(treasury_in_db)

    def test_read_treasuries(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/treasury/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.treasury_db.model_dump(by_alias=True)]

    def test_read_last_treasury(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/treasury/last")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.treasury_db.model_dump(by_alias=True)

    async def test_update_treasury(self):
        # Arrange
        treasury_update = TreasuryUpdate(
            lydia_rate=0.02,
        )

        # Act
        response = self._client.put(
            f"/api/v1/treasury/{self.treasury_db.id}",
            json=treasury_update.model_dump(by_alias=True),
        )

        treasury_db = await self.read_treasury_from_db(self.treasury_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("lydiaRate") == treasury_update.lydia_rate
        assert treasury_db is not None
        assert treasury_db.lydia_rate == treasury_update.lydia_rate

    async def test_update_treasury_not_found(self):
        # Arrange
        treasury_update = TreasuryUpdate(
            lydia_rate=0.02,
        )

        # Act
        response = self._client.put(
            "/api/v1/treasury/0",
            json=treasury_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Treasury not found"}
