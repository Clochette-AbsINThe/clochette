from pydantic import BaseModel, Field, PrivateAttr

from app.schemas.barrel import BarrelInDB


class GlassBase(BaseModel):
    pass


class GlassCreate(GlassBase):
    pass


class GlassUpdate(GlassBase):
    pass


class Glass(GlassBase):
    id: int
    barrel_id: int
    _barrel: BarrelInDB = PrivateAttr(default_factory=BarrelInDB)
    name: str
    sell_price: float = Field(..., gt=0)

    def __init__(self, **data):
        super().__init__(**data)
        self.name = self._barrel.default_factory().drink.name
        self.sell_price = self._barrel.default_factory().sell_price

    class Config:
        orm_mode = True

class GlassFront(GlassBase):
    id: int
    barrel_id: int
    name: str
    sell_price: float = Field(..., gt=0)