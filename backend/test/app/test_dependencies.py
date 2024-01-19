from test.base_test import BaseTest

from fastapi import HTTPException, status
from fastapi.security import SecurityScopes
from jose import jwt

from app.core.config import settings
from app.core.security import create_access_token
from app.crud.crud_account import account as crud_account
from app.dependencies import get_current_account, get_current_active_account, get_db
from app.schemas.account import Account, AccountCreate


class TestGetCurrentAccount(BaseTest):
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
            self.account_db = await crud_account.create(
                session, obj_in=self.account_create
            )

        self.security_scopes = SecurityScopes(["staff"])
        self.token = create_access_token(
            subject=self.account_db.id,
            scopes=["staff"],
        )

    async def test_get_current_account_jwt_error(self):
        # Arrange
        modified_token = self.token + "modified"

        # Act
        with self.assertRaises(HTTPException) as error:
            await get_current_account(
                security_scopes=self.security_scopes,
                token=modified_token,
                db=get_db.get_session(),
            )

        # Assert
        assert error.exception.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token could not be parsed" in self._caplog.text

    async def test_get_current_account_no_sub(self):
        # Arrange
        to_encode = {"scopes": self.security_scopes.scopes}
        modified_token = jwt.encode(
            to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
        )

        with self.assertRaises(HTTPException) as error:
            await get_current_account(
                security_scopes=self.security_scopes,
                token=modified_token,
                db=get_db.get_session(),
            )

        assert error.exception.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Id not in payload" in self._caplog.text

    async def test_get_current_account_acount_not_found(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_account.delete(session, id=self.account_db.id)

        with self.assertRaises(HTTPException) as error:
            await get_current_account(
                security_scopes=self.security_scopes,
                token=self.token,
                db=get_db.get_session(),
            )

        assert error.exception.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Account does not exist" in self._caplog.text

    async def test_get_current_account_no_token_scope(self):
        # Arrange
        modified_token = create_access_token(subject=self.account_db.id, scopes=[])

        with self.assertRaises(HTTPException) as error:
            await get_current_account(
                security_scopes=self.security_scopes,
                token=modified_token,
                db=get_db.get_session(),
            )

        assert error.exception.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token has no scope" in self._caplog.text

    async def test_get_current_account_no_required_scope(self):
        # Arrange
        modified_scopes = SecurityScopes(["president"])

        with self.assertRaises(HTTPException) as error:
            await get_current_account(
                security_scopes=modified_scopes,
                token=self.token,
                db=get_db.get_session(),
            )

        assert error.exception.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Token does not have the required scopes" in self._caplog.text

    async def test_get_current_account_success(self):
        # Arrange
        current_account = await get_current_account(
            security_scopes=self.security_scopes,
            token=self.token,
            db=get_db.get_session(),
        )

        # Assert
        account = Account.model_validate(current_account)

        assert account.id == self.account_db.id
        assert account.username == self.account_db.username
        assert account.scope == self.account_db.scope
        assert account.is_active == self.account_db.is_active
        assert account.last_name == self.account_db.last_name
        assert account.first_name == self.account_db.first_name
        assert account.promotion_year == self.account_db.promotion_year

    async def test_get_current_active_account_inactive(self):
        # Arrange
        async with get_db.get_session() as session:
            await crud_account.update(
                session, db_obj=self.account_db, obj_in={"is_active": False}
            )

        with self.assertRaises(HTTPException) as error:
            await get_current_active_account(
                current_account=self.account_db,
            )

        assert error.exception.status_code == status.HTTP_400_BAD_REQUEST
        assert "Account is inactive" in self._caplog.text

    async def test_get_current_active_account_success(self):
        async with get_db.get_session() as session:
            await crud_account.update(
                session, db_obj=self.account_db, obj_in={"is_active": True}
            )

        # Arrange
        current_account = await get_current_active_account(
            current_account=self.account_db,
        )

        # Assert
        account = Account.model_validate(current_account)

        assert account.id == self.account_db.id
        assert account.username == self.account_db.username
        assert account.scope == self.account_db.scope
        assert account.is_active == self.account_db.is_active
        assert account.last_name == self.account_db.last_name
        assert account.first_name == self.account_db.first_name
        assert account.promotion_year == self.account_db.promotion_year
