from test.base_test import BaseTest

from app.core.config import settings
from app.crud.crud_account import account as crud_account
from app.dependencies import get_db
from app.schemas.account import Account, AccountCreate, AccountUpdate, OwnAccountUpdate


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
            self.account_db = Account.model_validate(await crud_account.create(session, obj_in=self.account_create))

    async def read_account_from_db(self, id: int) -> Account | None:
        async with get_db.get_session() as session:
            account_in_db = await crud_account.read(session, id)
            if account_in_db is None:
                return None
            return Account.model_validate(account_in_db)

    async def activate_account(self, id: int) -> None:
        async with get_db.get_session() as session:
            account_in_db = await crud_account.read(session, id)
            if account_in_db is None:
                return
            await crud_account.update(session, db_obj=account_in_db, obj_in=AccountUpdate(is_active=True))

    def get_access_token(self) -> str:
        return self._client.post(
            "/api/v1/auth/login/",
            data={
                "username": self.account_db.username,
                "password": settings.BASE_ACCOUNT_PASSWORD,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        ).json()["access_token"]

    async def test_login(self):
        # Arrange
        await self.activate_account(self.account_db.id)
        # Act
        response = self._client.post(
            "/api/v1/auth/login/",
            data={
                "username": self.account_db.username,
                "password": settings.BASE_ACCOUNT_PASSWORD,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        # Assert
        assert response.status_code == 200
        assert response.json().get("access_token") is not None

    async def test_login_unknown_account(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/auth/login/",
            data={"username": "unknown", "password": "unknown"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        # Assert
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid credentials"}
        assert "Account unknown not found" in self._caplog.text

    async def test_login_wrong_password(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/auth/login/",
            data={
                "username": self.account_db.username,
                "password": "wrong password",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        # Assert
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid credentials"}
        assert "Invalid password for testuser" in self._caplog.text

    async def test_login_inactive_account(self):
        # Arrange
        # Act
        response = self._client.post(
            "/api/v1/auth/login/",
            data={
                "username": self.account_db.username,
                "password": settings.BASE_ACCOUNT_PASSWORD,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        # Assert
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid credentials"}
        assert "Account testuser is not active" in self._caplog.text

    async def test_read_account_me(self):
        # Arrange
        self.wipe_dependencies_overrides()
        await self.activate_account(self.account_db.id)
        token = self.get_access_token()

        # Act
        response = self._client.get(
            "/api/v1/auth/me/",
            headers={"Authorization": f"Bearer {token}"},
        )
        account_in_db = await self.read_account_from_db(self.account_db.id)

        # Assert
        assert response.status_code == 200
        assert account_in_db is not None
        assert response.json() == account_in_db.model_dump(by_alias=True)

    async def test_update_account_me(self):
        # Arrange
        self.wipe_dependencies_overrides()
        await self.activate_account(self.account_db.id)
        token = self.get_access_token()
        modified_account = OwnAccountUpdate(
            last_name="changed",
        )

        # Act
        response = self._client.put(
            "/api/v1/auth/me/",
            json=modified_account.model_dump(by_alias=True),
            headers={"Authorization": f"Bearer {token}"},
        )
        account_in_db = await self.read_account_from_db(self.account_db.id)

        # Assert
        assert response.status_code == 200
        assert response.json().get("lastName") == modified_account.last_name
        assert account_in_db is not None
        assert account_in_db.last_name == modified_account.last_name

    async def test_update_account_me_username_already_exists(self):
        # Arrange
        self.wipe_dependencies_overrides()
        await self.activate_account(self.account_db.id)
        token = self.get_access_token()
        new_account_create = AccountCreate(
            username="testuser2",
            last_name="test",
            first_name="user",
            promotion_year=2021,
            password=settings.BASE_ACCOUNT_PASSWORD,
        )
        async with get_db.get_session() as session:
            new_account = Account.model_validate(await crud_account.create(session, obj_in=new_account_create))
        modified_account = OwnAccountUpdate(
            username=new_account.username,
        )

        # Act
        response = self._client.put(
            "/api/v1/auth/me/",
            json=modified_account.model_dump(by_alias=True),
            headers={"Authorization": f"Bearer {token}"},
        )

        # Assert
        assert response.status_code == 400
        assert response.json() == {"detail": "Username is unavailable"}
        assert "Username testuser2 already exists" in self._caplog.text
