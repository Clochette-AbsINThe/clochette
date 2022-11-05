from app.core.config import DefaultModel

class DrinkBase(DefaultModel):
    name: str


class DrinkCreate(DrinkBase):
    pass


class DrinkUpdate(DrinkBase):
    pass


class Drink(DrinkBase):
    id: int

    class Config:
        orm_mode = True


class DrinkSearchResults(DefaultModel):
    results: list[Drink]
