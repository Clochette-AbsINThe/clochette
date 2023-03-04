from datetime import datetime
from warnings import warn

from pydantic import Field, validator
from zxcvbn import zxcvbn

from app.core.config import DefaultModel
from app.core.security import get_password_hash, is_hashed_password
from app.core.types import SecurityScopes
from app.core.utils.misc import to_query_parameters


def validate_password(password: str | None, values: dict | None = None) -> str:
    if password is None:
        warn("Password is None", Warning) # TODO: Remove this line after testing because it should never happen
        return password

    if is_hashed_password(password):
        # Password is already hashed, it should have been validated before being stored in the database so it's ok to return it
        return password

    # Validate password strength using zxcvbn
    password_strength = zxcvbn(password, user_inputs=[v for v in values.values()] if values else None)
    if password_strength["score"] < 3:
        raise ValueError(f"Password is too weak: {password_strength['feedback']['warning']}")

    return get_password_hash(password)


class AccountBase(DefaultModel):
    username: str = Field(..., min_length=3, max_length=32)
    last_name: str
    first_name: str
    password: str
    scope: SecurityScopes
    is_active: bool
    promotion_year: int = Field(..., ge=2000, le=datetime.now().year + 3) # Promotion year must be less than 3 years in the future

    _validate_password = validator("password", allow_reuse=True)(validate_password)


class AccountCreate(AccountBase):
    is_active: bool | None = False
    scope: SecurityScopes | None = SecurityScopes.staff

    @validator("is_active")
    def is_active_must_be_false_at_creation(cls, v: bool) -> bool:
        return False


class AccountUpdate(AccountBase):
    username: str | None = Field(min_length=3, max_length=32)
    last_name: str | None
    first_name: str | None
    password: str | None
    scope: SecurityScopes | None
    is_active: bool | None
    promotion_year: int | None = Field(ge=2000, le=datetime.now().year + 3) # Promotion year must be less than 3 years in the future

    _validate_password = validator("password", allow_reuse=True)(validate_password)


class OwnAccountUpdate(AccountUpdate):
    is_active: bool | None = Field(exclude=True)
    scope: SecurityScopes | None = Field(exclude=True)


class Account(AccountBase):
    id: int
    password: str = Field(exclude=True)

    class Config:
        orm_mode = True