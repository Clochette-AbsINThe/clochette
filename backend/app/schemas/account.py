from app.core.config import DefaultModel


class AccountBase(DefaultModel):
    username: str
    password: str
    roles: str
    is_active: bool
    last_name: str
    first_name: str
    amount: float
    promotion_year: int
    staff_name: str
    is_inducted: bool


class AccountCreate(AccountBase):
    pass


class AccountUpdate(AccountBase):
    id: int


class Account(AccountBase):
    id: int
    transactions: list = []

    class Config:
        orm_mode = True