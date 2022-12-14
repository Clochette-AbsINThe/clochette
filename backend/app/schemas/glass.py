from pydantic import Field, validator

from app.core.config import DefaultModel
from app.schemas.barrel import Barrel


class GlassBase(DefaultModel):
    barrel_id: int = Field(..., alias='fkId')


class GlassCreate(GlassBase):
    transaction_id: int = 0


class TransactionCreate(GlassBase):
    pass


class GlassUpdate(GlassBase):
    pass


class Glass(GlassBase):
    id: int
    barrel: Barrel = Field(..., exclude=True)
    name: str | None

    @validator('name', always=True)
    def populate_name(cls, v, values):
        return values['barrel'].name
    
    sell_price: float | None

    @validator('sell_price', always=True)
    def populate_sell_price(cls, v, values):
        return values['barrel'].sell_price

    class Config:
        orm_mode = True
