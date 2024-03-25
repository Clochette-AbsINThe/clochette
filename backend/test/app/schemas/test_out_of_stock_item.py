from app.core.types import IconName
from app.schemas.out_of_stock_item import OutOfStockItemBase


def test_out_of_stock_item_computed_field():
    out_of_stock_item = OutOfStockItemBase(name="Coke", icon=IconName.SOFT, sell_price=2.5)
    assert out_of_stock_item.buy_or_sell is False
    assert out_of_stock_item.model_dump()["buy_or_sell"] is False
    assert out_of_stock_item.model_dump()["sell_price"] == 2.5

    out_of_stock_item = OutOfStockItemBase(name="Coke", icon=IconName.SOFT)
    assert out_of_stock_item.buy_or_sell is True
    assert out_of_stock_item.model_dump()["buy_or_sell"] is True
    assert out_of_stock_item.model_dump()["sell_price"] is None
