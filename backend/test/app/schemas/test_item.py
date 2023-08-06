import pytest
from pydantic import ValidationError

from app.schemas.barrel import BarrelCreate
from app.schemas.consumable import ConsumableCreate
from app.schemas.glass import GlassCreate
from app.schemas.item import Item
from app.schemas.out_of_stock import OutOfStockCreate


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


class TestEachItem:
    def test_consumable(self):
        item = Item(
            table="consumable",
            quantity=1,
            item={"id": 1, "fkId": 1, "unitPrice": 1.0, "sellPrice": 1.0},
        )
        assert isinstance(item.computed_item, ConsumableCreate)
        assert item.computed_item.unit_price == 1.0

    def test_out_of_stock(self):
        item = Item(
            table="out_of_stock", quantity=1, item={"fkId": 1, "unitPrice": 1.0}
        )
        assert isinstance(item.computed_item, OutOfStockCreate)
        assert item.computed_item.unit_price == 1.0

    def test_barrel(self):
        item = Item(
            table="barrel",
            quantity=1,
            item={"fkId": 1, "unitPrice": 1.0, "sellPrice": 1.0},
        )
        assert isinstance(item.computed_item, BarrelCreate)
        assert item.computed_item.unit_price == 1.0

    def test_glass(self):
        item = Item(table="glass", quantity=1, item={"fkId": 1})
        assert isinstance(item.computed_item, GlassCreate)
        assert item.computed_item.barrel_id == 1
