from datetime import datetime

from pydantic import Field, validator

from app.core.config import DefaultModel
from app.core.security import get_password_hash


def validate_password(password: str | None, values: dict | None = None) -> str:
    if password is None:
        return password

    # Password must be at least 8 characters long
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")

    # Password must contain at least one number
    if not any(char.isdigit() for char in password):
        raise ValueError("Password must contain at least one number")

    # Password must contain at least one uppercase letter
    if not any(char.isupper() for char in password):
        raise ValueError("Password must contain at least one uppercase letter")

    # Password must contain at least one lowercase letter
    if not any(char.islower() for char in password):
        raise ValueError("Password must contain at least one lowercase letter")

    # Password must contain at least one special character
    if not any(char in "!@#$%^&*()_+-=[]{};:,./<>?" for char in password):
        raise ValueError("Password must contain at least one special character")

    # Password must not contain any whitespace
    if " " in password:
        raise ValueError("Password must not contain any whitespace")

    # Password must not be the same as the username
    if password == values["username"]:
        raise ValueError("Password must not be the same as the username")

    return get_password_hash(password)


class AccountBase(DefaultModel):
    username: str
    roles: str
    is_active: bool
    last_name: str
    first_name: str
    promotion_year: int = Field(..., ge=2000, le=datetime.now().year + 3) # Promotion year must be less than 3 years in the future
    staff_name: str
    is_inducted: bool


class AccountCreate(AccountBase):
    is_active: bool = False

    @validator("is_active")
    def is_active_must_be_false_at_creation(cls, v: bool) -> bool:
        return False

    password: str

    _validate_password = validator("password", allow_reuse=True)(validate_password)


class AccountUpdate(AccountBase):
    password: str | None = None

    _validate_password = validator("password", allow_reuse=True)(validate_password)


class Account(AccountBase):
    id: int

    class Config:
        orm_mode = True