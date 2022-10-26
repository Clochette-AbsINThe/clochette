from pydantic import BaseModel, Field

from app.core.types import IconName
from app.schemas.drink import Drink


class BarrelBase(BaseModel):
    empty: bool = False
    icon: IconName
    is_mounted: bool = False
    sell_price: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class BarrelCreate(BarrelBase):
    pass


class BarrelUpdate(BarrelBase):
    pass


class BarrelInDB(BarrelBase):
    id: int
    drink_id: int
    drink: Drink

    class Config:
        orm_mode = True


class Barrel(BarrelBase):
    id: int
    drink_id: int

    class Config:
        orm_mode = True
