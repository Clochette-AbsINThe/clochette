from sqlalchemy import Boolean, Column, Enum, Integer, String

from app.core.types import SecurityScopes
from app.db.base_class import Base


class Account(Base):
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(256), nullable=False)
    password = Column(String(512), nullable=False)
    scope = Column(Enum(SecurityScopes), nullable=False)
    is_active = Column(Boolean, nullable=False)
    last_name = Column(String(256), nullable=False)
    first_name = Column(String(256), nullable=False)
    promotion_year = Column(Integer, nullable=False)