from typing import TYPE_CHECKING, List

from sqlalchemy.orm import relationship

from app.core.types import IconName
from app.db.base_class import Base, Mapped, Str256

if TYPE_CHECKING:  # pragma: no cover
    from .consumable import Consumable


class ConsumableItem(Base):
    """This model represents a consumable item in the database.

    Attributes:
        - `name`: The name of the consumable item.
        - `icon`: The icon of the consumable item.
    """

    name: Mapped[Str256]
    icon: Mapped[IconName]

    consumables: Mapped[List["Consumable"]] = relationship(
        back_populates="consumable_item", lazy="selectin"
    )
