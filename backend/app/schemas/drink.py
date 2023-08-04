from pydantic import ConfigDict

from app.schemas.base import DefaultModel


class DrinkBase(DefaultModel):
    name: str


class DrinkCreate(DrinkBase):
    pass


class DrinkUpdate(DrinkBase):
    name: str | None = None


class Drink(DrinkBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
