from pydantic import ConfigDict

from app.core.types import IconName
from app.schemas.base import DefaultModel


class ConsumableItemBase(DefaultModel):
    name: str
    icon: IconName


class ConsumableItemCreate(ConsumableItemBase):
    pass


class ConsumableItemUpdate(ConsumableItemBase):
    name: str | None = None
    icon: IconName | None = None


class ConsumableItem(ConsumableItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
