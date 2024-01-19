import datetime

import pytest
from pydantic import ValidationError

from app.core.types import PaymentMethod, TransactionTypeV1
from app.schemas.item import Item
from app.schemas.transaction import TransactionCreate, TransactionFrontCreate


def test_transaction_create_model():
    datetime_now = datetime.datetime.now()
    transaction_create_dict = {
        "datetime": datetime_now,
        "payment_method": PaymentMethod.CASH,
        "sale": True,
        "amount": 10.012,
        "type": TransactionTypeV1.TRANSACTION,
        "description": "Test transaction",
    }
    transaction_create = TransactionCreate(**transaction_create_dict)
    assert transaction_create.datetime == transaction_create_dict["datetime"]
    assert (
        transaction_create.payment_method == transaction_create_dict["payment_method"]
    )
    assert transaction_create.sale == transaction_create_dict["sale"]
    assert transaction_create.amount == round(transaction_create_dict["amount"], 2)
    assert transaction_create.type == transaction_create_dict["type"]
    assert transaction_create.description == transaction_create_dict["description"]
    assert transaction_create.treasury_id == 1


def test_transaction_front_create_model():
    datetime_now = datetime.datetime.now()
    item_dict = {
        "id": 1,
        "table": "glass",
        "item": {
            "fkId": 1,
        },
        "quantity": 2,
    }
    transaction_front_create_dict = {
        "datetime": datetime_now,
        "payment_method": PaymentMethod.CASH,
        "sale": True,
        "amount": 10.0,
        "type": TransactionTypeV1.TRANSACTION,
        "description": "Test transaction",
        "items": [item_dict],
    }
    transaction_front_create = TransactionFrontCreate(**transaction_front_create_dict)
    assert (
        transaction_front_create.datetime == transaction_front_create_dict["datetime"]
    )
    assert (
        transaction_front_create.payment_method
        == transaction_front_create_dict["payment_method"]
    )
    assert transaction_front_create.sale == transaction_front_create_dict["sale"]
    assert transaction_front_create.amount == transaction_front_create_dict["amount"]
    assert transaction_front_create.type == transaction_front_create_dict["type"]
    assert (
        transaction_front_create.description
        == transaction_front_create_dict["description"]
    )
    assert transaction_front_create.items == [Item(**item_dict)]


def test_transaction_front_create_model_empty_items():
    datetime_now = datetime.datetime.now()
    transaction_front_create_dict = {
        "datetime": datetime_now,
        "payment_method": PaymentMethod.CASH,
        "sale": True,
        "amount": 10.0,
        "type": TransactionTypeV1.TRESORERY,
        "description": "Test transaction",
        "items": [],
    }
    transaction_front_create = TransactionFrontCreate(**transaction_front_create_dict)
    assert (
        transaction_front_create.datetime == transaction_front_create_dict["datetime"]
    )
    assert (
        transaction_front_create.payment_method
        == transaction_front_create_dict["payment_method"]
    )
    assert transaction_front_create.sale == transaction_front_create_dict["sale"]
    assert transaction_front_create.amount == transaction_front_create_dict["amount"]
    assert transaction_front_create.type == transaction_front_create_dict["type"]
    assert (
        transaction_front_create.description
        == transaction_front_create_dict["description"]
    )
    assert transaction_front_create.items == []


def test_transaction_front_create_model_empty_items_error():
    datetime_now = datetime.datetime.now()
    transaction_front_create_dict = {
        "datetime": datetime_now,
        "payment_method": PaymentMethod.CASH,
        "sale": True,
        "amount": 10.0,
        "type": TransactionTypeV1.TRANSACTION,
        "description": "Test transaction",
        "items": [],
    }
    with pytest.raises(ValidationError):
        TransactionFrontCreate(**transaction_front_create_dict)
