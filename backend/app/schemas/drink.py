from app.core.config import DefaultModel


class DrinkBase(DefaultModel):
    name: str


class DrinkCreate(DrinkBase):
    pass


class DrinkUpdate(DrinkBase):
    name: str | None


class Drink(DrinkBase):
    id: int

    class Config:
        orm_mode = True

