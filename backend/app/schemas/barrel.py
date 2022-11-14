from pydantic import Field

from app.core.config import DefaultModel
from app.core.types import IconName
from app.schemas.drink import Drink


class BarrelBase(DefaultModel):
    drink_id: int | None = Field(..., alias='fkId')
    empty: bool = False
    icon: IconName
    is_mounted: bool = False
    sell_price: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class BarrelCreate(BarrelBase):
    pass


class BarrelUpdate(BarrelBase):
    pass


class Barrel(BarrelBase):
    id: int

    class Config:
        orm_mode = True


class TransactionCreate(BarrelCreate):
    pass