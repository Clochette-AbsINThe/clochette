from datetime import datetime
from typing import Annotated

from sqlalchemy import DateTime, ForeignKey, String, UnicodeText, inspect
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column

PrimaryKey = Annotated[int, mapped_column(primary_key=True, nullable=False)]
Str256 = Annotated[str, mapped_column(String(256), nullable=False)]
Str512 = Annotated[str, mapped_column(String(512), nullable=False)]
Datetime = Annotated[datetime, mapped_column(DateTime(timezone=True), nullable=False)]
Text = Annotated[str, mapped_column(UnicodeText, nullable=True)]


# Decorate the `Base` class to make it a declarative base class
class Base(DeclarativeBase):
    # id field for all models
    id: Mapped[PrimaryKey]

    # Generate __tablename__ automatically
    @declared_attr.directive
    def __tablename__(self) -> str:
        return self.__name__.lower()

    def __str__(self) -> str:
        atrs = ", ".join(f"{k}={v}" for k, v in self.attributes)
        return f"<{self.__class__.__name__} - {atrs}>"

    def __repr__(self) -> str:
        return str(self)

    @property
    def attributes(self):
        """Iterate over the attributes of the model.

        Yields:
            Tuple[str, Any]: The name of the attribute and its value.
        """
        for key, value in inspect(self).attrs.items():
            yield key, value.value


def build_fk_annotation(class_name: str):
    """
    Build a foreign key annotation for a given class name.

    :param class_name: The name of the class to build the foreign key for.
    :return: The foreign key annotation.
    """
    return Annotated[int, mapped_column(ForeignKey(f"{class_name}.id"))]
