from pydantic import Field, validator

from app.core.config import DefaultModel
from app.schemas.drink import Drink


class BarrelBase(DefaultModel):
    drink_id: int | None = Field(..., alias='fkId')
    empty: bool = False
    is_mounted: bool = False
    sell_price: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)


class BarrelCreate(BarrelBase):
    pass


class BarrelUpdate(BarrelBase):
    pass


class Barrel(BarrelBase):
    id: int
    drink: Drink | None = Field(..., exclude=True)
    name: str | None

    @validator('name', always=True)
    def populate_name(cls, v, values):
        return values['drink'].name

    class Config:
        orm_mode = True


class TransactionCreate(BarrelCreate):
    pass