from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Account(Base):
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(256), nullable=False)
    password = Column(String(512), nullable=False)
    scopes = Column(String(256), nullable=False)
    is_active = Column(Boolean, nullable=False)
    last_name = Column(String(256), nullable=False)
    first_name = Column(String(256), nullable=False)
    promotion_year = Column(Integer, nullable=False)