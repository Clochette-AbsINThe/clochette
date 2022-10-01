from pydantic import BaseModel


class BarrelBase(BaseModel):
    price: float
    is_mounted: bool = False
    empty: bool = False


class BarrelCreate(BarrelBase):
    pass


class BarrelUpdate(BarrelBase):
    pass


class Barrel(BarrelBase):
    id: int
    treasury_id: int
    drink_id: int
    stock_id: int
    price: float
    is_mounted: bool
    empty: bool

    class Config:
        orm_mode = True
