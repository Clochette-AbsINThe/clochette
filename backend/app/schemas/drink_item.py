from pydantic import ConfigDict

from app.schemas.base import DefaultModel


class DrinkItemBase(DefaultModel):
    name: str


class DrinkItemCreate(DrinkItemBase):
    pass


class DrinkItemUpdate(DrinkItemBase):
    name: str | None = None


class DrinkItem(DrinkItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
