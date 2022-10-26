from pydantic import BaseModel, Field

from app.core.types import IconName


class BarrelBase(BaseModel):
    empty: bool = False
    icon: IconName
    is_mounted: bool = False
    sellPrice: float = Field(..., gt=0)
    unitPrice: float = Field(..., gt=0)


class BarrelCreate(BarrelBase):
    pass


class BarrelUpdate(BarrelBase):
    pass


class Barrel(BarrelBase):
    id: int
    drink_id: int

    class Config:
        orm_mode = True
