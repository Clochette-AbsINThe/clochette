import pytest

from app.models.barrel import Barrel as BarrelModel
from app.models.drink_item import DrinkItem as DrinkModel
from app.schemas.barrel import Barrel, BarrelCreate


def test_barrel_computed_field():
    drink_model = DrinkModel(id=1, name="Coke")
    barrel_model = BarrelModel(
        id=1,
        sell_price=2.5,
        buy_price=1.5,
        drink_item_id=1,
        is_mounted=True,
        empty_or_solded=False,
        drink_item=drink_model,
    )

    barrel = Barrel.model_validate(barrel_model).model_dump()

    assert barrel["name"] == "Coke"

    with pytest.raises(KeyError):
        barrel.pop("drink")


def test_barrel_create():
    barrel_dict = {
        "drink_id": 1,
        "sell_price": 2.5,
        "buy_price": 1.5,
        "transaction_id": 1,
    }
    barrel = BarrelCreate(**barrel_dict)
    assert barrel.model_dump().get("empty_or_solded") is False
    assert barrel.model_dump().get("is_mounted") is False
