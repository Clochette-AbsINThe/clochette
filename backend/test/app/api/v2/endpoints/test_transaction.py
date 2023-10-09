import datetime
from test.base_test import BaseTest

from app.core.types import PaymentMethod, Status, TradeType, TransactionType
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.transaction import (
    Transaction,
    TransactionCommerceCreate,
    TransactionTreasuryCreate,
)


class TestTransaction(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        async with get_db.get_session() as session:
            await crud_treasury.create(
                session,
                obj_in=TreasuryCreate(total_amount=0, cash_amount=0, lydia_rate=0.015),
            )

            transaction_create = TransactionTreasuryCreate(
                datetime=datetime.datetime.now(),
                payment_method=PaymentMethod.CARD,
                trade=TradeType.PURCHASE,
                amount=10,
                description="test",
            )

            self.transaction_db = Transaction.model_validate(
                await crud_transaction.create_v2(session, obj_in=transaction_create)
            )

        assert self.transaction_db.description == transaction_create.description

    def test_read_transactions(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/transaction/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [
            self.transaction_db.model_dump(by_alias=True, mode="json")
        ]

    def test_read_transaction(self):
        # Arrange
        # Act
        response = self._client.get(f"/api/v2/transaction/{self.transaction_db.id}")

        # Assert
        assert response.status_code == 200
        assert response.json()["id"] == self.transaction_db.id
        assert response.json()["type"] == TransactionType.TRESORERY.value
        assert response.json()["status"] == Status.VALIDATED.value

    def test_read_transaction_not_found(self):
        # Arrange
        # Act
        response = self._client.get("/api/v2/transaction/0")

        # Assert
        assert response.status_code == 404

    async def test_create_transaction(self):
        # Arrange
        transaction_create = TransactionCommerceCreate(
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            trade=TradeType.PURCHASE,
        )

        # Act
        response = self._client.post(
            "/api/v2/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=response.json()["id"]
            )
            assert transaction_in_db is not None
            assert transaction_in_db.type == TransactionType.COMMERCE
            assert transaction_in_db.status == Status.PENDING

    def test_create_transaction_already_pending(self):
        # Arrange
        transaction_create = TransactionCommerceCreate(
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            trade=TradeType.PURCHASE,
        )
        self._client.post(
            "/api/v2/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )

        # Act
        response = self._client.post(
            "/api/v2/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )

        # Assert
        assert response.status_code == 400

    async def test_create_transaction_tresorery(self):
        # Arrange
        transaction_create = TransactionTreasuryCreate(
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            trade=TradeType.PURCHASE,
            amount=10,
            description="test",
        )

        # Act
        response = self._client.post(
            "/api/v2/transaction/treasury/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=response.json()["id"]
            )
            assert transaction_in_db is not None
            assert transaction_in_db.type == TransactionType.TRESORERY
            assert transaction_in_db.status == Status.VALIDATED

    async def test_validate_transaction(self):
        # Arrange
        transaction_create = TransactionCommerceCreate(
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            trade=TradeType.PURCHASE,
        )
        response = self._client.post(
            "/api/v2/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )

        # Act
        response = self._client.patch(
            f"/api/v2/transaction/{response.json()['id']}/validate",
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=response.json()["id"]
            )
            assert transaction_in_db is not None
            assert transaction_in_db.status == Status.VALIDATED
            assert transaction_in_db.type == TransactionType.COMMERCE
            assert transaction_in_db.amount == 0

    async def test_validate_transaction_not_pending(self):
        # Arrange
        transaction_create = TransactionCommerceCreate(
            datetime=datetime.datetime.now(),
            payment_method=PaymentMethod.CARD,
            trade=TradeType.PURCHASE,
        )
        response = self._client.post(
            "/api/v2/transaction/",
            json=transaction_create.model_dump(by_alias=True, mode="json"),
        )
        self._client.patch(
            f"/api/v2/transaction/{response.json()['id']}/validate",
        )

        # Act
        response = self._client.patch(
            f"/api/v2/transaction/{response.json()['id']}/validate",
        )

        # Assert
        assert response.status_code == 400

    async def test_validate_transaction_not_found(self):
        # Arrange
        # Act
        response = self._client.patch(
            "/api/v2/transaction/0/validate",
        )

        # Assert
        assert response.status_code == 404

    async def test_delete_transaction(self):
        # Arrange
        # Act
        response = self._client.delete(
            f"/api/v2/transaction/{self.transaction_db.id}",
        )

        # Assert
        assert response.status_code == 200
        async with get_db.get_session() as session:
            transaction_in_db = await crud_transaction.read(
                session, id=response.json()["id"]
            )
            assert transaction_in_db is None

    def test_delete_transaction_not_found(self):
        # Arrange
        # Act
        response = self._client.delete(
            "/api/v2/transaction/0",
        )

        # Assert
        assert response.status_code == 404
