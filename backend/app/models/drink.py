from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, Str256

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel


class Drink(Base):
    name: Mapped[Str256]

    barrels: Mapped[List["Barrel"]] = relationship(
        back_populates="drink", lazy="selectin"
    )
