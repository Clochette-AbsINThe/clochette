from datetime import datetime as _datetime
from operator import gt
from test.base_test import BaseTest
from typing import Optional
from unittest.mock import patch

from app.crud.base import CRUDBase, patch_timezone_sqlite
from app.db.base_class import Base, Datetime, Mapped, Str256, Str512
from app.db.databases.postgres import PostgresDatabase
from app.dependencies import get_db
from app.schemas.base import DefaultModel


class ModelUser(Base):
    email: Mapped[Str256]
    password: Mapped[Str512]
    datetime: Mapped[Datetime]


class UserCreate(DefaultModel):
    email: str
    password: str
    datetime: _datetime


class UserUpdate(DefaultModel):
    email: Optional[str] = None
    password: Optional[str] = None
    datetime: Optional[_datetime] = None


class CRUDUser(CRUDBase[ModelUser, UserCreate, UserUpdate]):
    ...


class TestBaseCRUD(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()
        # Arrange
        self.crud = CRUDUser(ModelUser)

        # Assert
        assert self.crud.model == ModelUser

        self.users = [
            UserCreate(
                email="user1@example.com",
                password="password1",
                datetime=_datetime.now(),
            ),
            UserCreate(
                email="user2@example.com",
                password="password2",
                datetime=_datetime.now(),
            ),
            UserCreate(
                email="user3@example.com",
                password="password3",
                datetime=_datetime.now(),
            ),
        ]

        async with get_db.get_session() as session:
            for user_in, id in zip(self.users, range(1, 4)):
                result = await self.crud.create(session, obj_in=user_in)

                assert result.id == id
                assert result.email == user_in.email
                assert result.password == user_in.password

    async def test_get(self):
        async with get_db.get_session() as session:
            # Act
            for user_in, id in zip(self.users, range(1, 4)):
                result = await self.crud.read(session, id=id)

                assert result is not None

                assert result.id == id
                assert result.email == user_in.email
                assert result.password == user_in.password

    async def test_get_all(self):
        async with get_db.get_session() as session:
            # Act
            result = await self.crud.query(session)

            # Assert
            assert len(result) == 3
            assert result[0].id == 1
            assert result[0].email == "user1@example.com"
            assert result[0].password == "password1"

    async def test_get_filter(self):
        async with get_db.get_session() as session:
            # Act
            result = await self.crud.query(session, email="user1@example.com")

            # Assert
            assert len(result) == 1
            assert result[0].id == 1
            assert result[0].email == "user1@example.com"

    async def test_get_filter_operator(self):
        async with get_db.get_session() as session:
            # Act
            result = await self.crud.query(session, id={gt: 2})

            # Assert
            assert len(result) == 1
            assert result[0].id == 3
            assert result[0].email == "user3@example.com"

    async def test_get_distinct(self):
        async with get_db.get_session() as session:
            # Act
            await self.crud.create(session, obj_in=self.users[0])

            assert len(await self.crud.query(session, distinct=ModelUser.id)) == 4
            assert len(await self.crud.query(session, distinct=ModelUser.email)) == 3

    async def test_update_with_dict(self):
        async with get_db.get_session() as session:
            # Act
            db_obj = await self.crud.read(session, id=1)
            if db_obj is None:
                raise Exception("db_obj is None")
            result = await self.crud.update(
                session, db_obj=db_obj, obj_in={"email": "modified@example.com"}
            )

            # Assert

            assert result is not None
            assert result.id == 1
            assert result.email == "modified@example.com"

    async def test_update_with_model(self):
        async with get_db.get_session() as session:
            # Act
            db_obj = await self.crud.read(session, id=1)
            if db_obj is None:
                raise Exception("db_obj is None")
            result = await self.crud.update(
                session,
                db_obj=db_obj,
                obj_in=UserUpdate(email="modified@example.com"),
            )

            # Assert

            assert result is not None
            assert result == await self.crud.read(session, id=1)
            assert result.id == 1
            assert result.email == "modified@example.com"

    async def test_delete(self):
        async with get_db.get_session() as session:
            # Act
            result = await self.crud.delete(session, id=1)

            # Assert
            assert result is not None
            assert result.id == 1
            assert result.email == "user1@example.com"

            assert await self.crud.read(session, id=1) is None


def test_patch_timezone_sqlite():
    create_model = ModelUser(
        email="user1@example.com",
        password="password1",
        datetime=_datetime.now(),
    )
    model = patch_timezone_sqlite(create_model)

    assert model.datetime.tzinfo is not None


@patch("app.crud.base.select_db", PostgresDatabase)
def test_patch_timezone_sqlite_postgres():
    create_model = ModelUser(
        email="user1@example.com",
        password="password1",
        datetime=_datetime.now(),
    )
    model = patch_timezone_sqlite(create_model)

    assert model.datetime.tzinfo is None
