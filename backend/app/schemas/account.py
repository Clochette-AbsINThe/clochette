from app.core.config import DefaultModel


class AccountBase(DefaultModel):
    username: str
    roles: str
    is_active: bool
    last_name: str
    first_name: str
    promotion_year: int
    staff_name: str
    is_inducted: bool


class AccountCreate(AccountBase):
    password: str


class AccountUpdate(AccountBase):
    password: str    


class Account(AccountBase):
    id: int

    class Config:
        orm_mode = True