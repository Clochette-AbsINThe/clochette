import pytest
from pydantic import ValidationError

from app.core.types import IconName
from app.models.out_of_stock import OutOfStock as OutOfStockModel
from app.models.out_of_stock_item import OutOfStockItem as OutOfStockItemModel
from app.schemas.out_of_stock import OutOfStock


def test_out_of_stock_computed_field():
    out_of_stock_item_model = OutOfStockItemModel(
        id=1, name="Coke", icon=IconName.SOFT, sell_price=2.5, buy_or_sell=False
    )
    out_of_stock_model = OutOfStockModel(
        id=1,
        item_id=1,
        item=out_of_stock_item_model,
        unit_price=1.5,
    )

    with pytest.raises(ValidationError):
        out_of_stock = OutOfStock.model_validate(out_of_stock_model).model_dump()

    out_of_stock_model = OutOfStockModel(
        id=1,
        item_id=1,
        item=out_of_stock_item_model,
    )
    out_of_stock = OutOfStock.model_validate(out_of_stock_model).model_dump()
    assert out_of_stock["name"] == "Coke"
    assert out_of_stock["icon"] == "Soft"
    assert out_of_stock["sell_price"] == 2.5

    with pytest.raises(KeyError):
        out_of_stock["out_of_stock_item"]

    out_of_stock_item_model = OutOfStockItemModel(id=1, name="Coke", icon=IconName.SOFT, buy_or_sell=True)
    out_of_stock_model = OutOfStockModel(
        id=1,
        item_id=1,
        item=out_of_stock_item_model,
    )

    with pytest.raises(ValidationError):
        out_of_stock = OutOfStock.model_validate(out_of_stock_model).model_dump()

    out_of_stock_model = OutOfStockModel(
        id=1,
        item_id=1,
        item=out_of_stock_item_model,
        unit_price=1.5,
    )
    out_of_stock = OutOfStock.model_validate(out_of_stock_model).model_dump()

    assert out_of_stock["name"] == "Coke"
    assert out_of_stock["icon"] == "Soft"
    assert out_of_stock["sell_price"] is None
    assert out_of_stock["unit_price"] == 1.5
