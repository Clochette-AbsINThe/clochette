import pytest

from app.core.types import IconName
from app.models.consumable import Consumable as ConsumableModel
from app.models.consumable_item import ConsumableItem as ConsumableItemModel
from app.schemas.consumable import Consumable, ConsumableCreate


def test_consumable_computed_field():
    consumable_item_model = ConsumableItemModel(id=1, name="Coke", icon=IconName.SOFT)
    consumable_model = ConsumableModel(
        id=1,
        sell_price=2.5,
        unit_price=1.5,
        consumable_item_id=1,
        consumable_item=consumable_item_model,
        empty=False,
    )

    consumable = Consumable.model_validate(consumable_model).model_dump()

    assert consumable["name"] == "Coke"
    assert consumable["icon"] == IconName.SOFT

    with pytest.raises(KeyError):
        consumable["consumable_item"]


def test_consumbale_create():
    consumable = ConsumableCreate(
        unit_price=1.5,
        sell_price=2.5,
        fkId=1,
    )
    assert consumable.empty is False
