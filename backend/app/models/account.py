from sqlalchemy.orm import Mapped

from app.core.types import SecurityScopes
from app.db.base_class import Base, Str256, Str512


class Account(Base):
    username: Mapped[Str256]
    password: Mapped[Str512]
    scope: Mapped[SecurityScopes]
    is_active: Mapped[bool]
    last_name: Mapped[Str256]
    first_name: Mapped[Str256]
    promotion_year: Mapped[int]
