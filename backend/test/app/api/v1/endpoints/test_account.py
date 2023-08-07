from test.base_test import BaseTest

from app.core.config import settings
from app.crud.crud_account import account as crud_account
from app.dependencies import get_db
from app.schemas.account import Account, AccountCreate, AccountUpdate


class TestAccount(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.account_create = AccountCreate(
            username="testuser",
            last_name="test",
            first_name="user",
            promotion_year=2021,
            password=settings.BASE_ACCOUNT_PASSWORD,
        )

        async with get_db.get_session() as session:
            self.account_db = Account.model_validate(
                await crud_account.create(session, obj_in=self.account_create)
            )

    async def read_account_from_db(self, id: int):
        async with get_db.get_session() as session:
            return await crud_account.read(session, id)

    def test_read_accounts(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/account/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.account_db.model_dump(by_alias=True)]

    def test_read_accounts_query_username(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/account/?username=wrong")

        # Assert
        assert response.status_code == 200
        assert response.json() == []

    def test_read_account(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v1/account/{self.account_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json() == self.account_db.model_dump(by_alias=True)

    def test_read_account_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/account/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Account not found"}

    async def test_create_account(self):
        # Arrange
        new_account_create = AccountCreate(
            username="testuser2",
            last_name="test",
            first_name="user",
            promotion_year=2021,
            password=settings.BASE_ACCOUNT_PASSWORD,
        )
        # Act
        response = self._client.post(
            "/api/v1/account/", json=new_account_create.model_dump(by_alias=True)
        )

        account_in_db = await self.read_account_from_db(response.json().get("id"))

        # Assert
        assert response.status_code == 200
        assert response.json().get("username") == new_account_create.username
        assert account_in_db is not None
        assert account_in_db.username == new_account_create.username

    async def test_create_account_username_already_exists(self):
        # Arrange
        new_account_create = AccountCreate(
            username="testuser",
            last_name="test",
            first_name="user",
            promotion_year=2021,
            password=settings.BASE_ACCOUNT_PASSWORD,
        )
        # Act
        response = self._client.post(
            "/api/v1/account/", json=new_account_create.model_dump(by_alias=True)
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Username is unavailable"}

    async def test_update_account(self):
        # Arrange
        account_update = AccountUpdate(last_name="changed")
        # Act
        response = self._client.put(
            f"/api/v1/account/{self.account_db.id}",
            json=account_update.model_dump(by_alias=True),
        )

        account_in_db = await self.read_account_from_db(self.account_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("lastName") == account_update.last_name
        assert account_in_db is not None
        assert account_in_db.last_name == account_update.last_name

    def test_update_account_not_found(self):
        # Arrange
        account_update = AccountUpdate(last_name="changed")
        # Act
        response = self._client.put(
            "/api/v1/account/0", json=account_update.model_dump(by_alias=True)
        )

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Account not found"}

    async def test_update_account_username_already_exists(self):
        # Arrange
        new_account_create = AccountCreate(
            username="testuser2",
            last_name="test",
            first_name="user",
            promotion_year=2021,
            password=settings.BASE_ACCOUNT_PASSWORD,
        )
        async with get_db.get_session() as session:
            new_account = Account.model_validate(
                await crud_account.create(session, obj_in=new_account_create)
            )

        account_update = AccountUpdate(username=new_account.username)
        # Act
        response = self._client.put(
            f"/api/v1/account/{self.account_db.id}",
            json=account_update.model_dump(by_alias=True),
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Username is unavailable"}

    async def test_delete_account(self):
        # Arrange
        # Act
        response = self._client.delete(f"/api/v1/account/{self.account_db.id}")

        account_in_db = await self.read_account_from_db(self.account_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json() == self.account_db.model_dump(by_alias=True)
        assert account_in_db is None

    def test_delete_account_not_found(self):
        # Arrange
        # Act
        response = self._client.delete("/api/v1/account/0")

        # Assert
        assert response.status_code == 404
        assert response.json() == {"detail": "Account not found"}
