from datetime import date
from typing import Optional, Sequence

from pydantic import BaseModel


class AccountBase(BaseModel):
    username: str
    password: str
    roles: str
    is_active: bool = True
    last_name: str
    first_name: str
    amount: float = 0
    promotion_year: int = date.today().year
    staff_name: str
    is_inducted: bool = False


# Properties to receive via API on creation
class AccountCreate(AccountBase):
    ...


# Properties to receive via API on update
class AccountUpdate(AccountBase):
    ...


# Properties shared by models stored in database
class AccountDB(AccountBase):
    id: int

    class Config:
        orm_mode = True


# Properties to retrun via API
class Account(AccountDB):
    pass


# Properties stored in database, allow to separate fields that are only relevant for the database
class AccountInDB(AccountDB):
    pass
