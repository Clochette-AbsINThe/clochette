import pytest
from pydantic import ValidationError

from app.schemas.item import Item


def test_does_this_table_exist():
    with pytest.raises(ValueError, match=r"No such table: invalid_table"):
        Item(table="invalid_table", quantity=1, item={})


def test_is_there_a_transaction_scheme():
    with pytest.raises(
        ValueError, match=r"Table item does not have a transaction scheme"
    ):
        Item(table="item", quantity=1, item={})


def test_check_table_scheme():
    with pytest.raises(ValidationError):
        Item(table="glass", quantity=1, item={"invalid_field": "value"})
