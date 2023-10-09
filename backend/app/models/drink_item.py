from typing import TYPE_CHECKING, List

from sqlalchemy.orm import Mapped, relationship

from app.db.base_class import Base, Str256

if TYPE_CHECKING:  # pragma: no cover
    from .barrel import Barrel


class DrinkItem(Base):
    """This model represents a drink item in the database.

    Attributes:
        - `name`: The name of the drink item.
    """

    name: Mapped[Str256]

    barrels: Mapped[List["Barrel"]] = relationship(
        back_populates="drink_item", lazy="selectin"
    )
