from sqlalchemy.orm import Mapped

from app.db.base_class import Base


class Treasury(Base):
    total_amount: Mapped[float]
    cash_amount: Mapped[float]
    lydia_rate: Mapped[float]
