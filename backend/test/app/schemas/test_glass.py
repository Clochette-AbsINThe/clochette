import pytest

from app.models.barrel import Barrel as BarrelModel
from app.models.drink import Drink as DrinkModel
from app.models.glass import Glass as GlassModel
from app.schemas.glass import Glass


def test_glass_computed_field():
    drink_model = DrinkModel.create(id=1, name="Coke")
    barrel_model = BarrelModel.create(
        id=1,
        sell_price=2.5,
        unit_price=1.5,
        drink_id=1,
        is_mounted=True,
        empty=False,
        drink=drink_model,
    )
    glass_model = GlassModel.create(id=1, barrel_id=1, barrel=barrel_model)

    glass = Glass.model_validate(glass_model).model_dump()

    assert glass["name"] == "Coke"
    assert glass["sell_price"] == 2.5

    with pytest.raises(KeyError):
        glass["barrel"]
