from pydantic import BaseModel


class GlassBase(BaseModel):
    price: float


class GlassCreate(GlassBase):
    pass


class GlassUpdate(GlassBase):
    pass


class Glass(GlassBase):
    id: int
    transaction_id: int
    barrel_id: int
    price: float

    class Config:
        orm_mode = True
