from datetime import datetime, timezone
from typing import Any, Generic, Sequence, Tuple, Type, TypeVar

from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import InstrumentedAttribute
from sqlalchemy.sql.expression import Select, select

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.db.base_class import Base
from app.db.databases.sqlite import SqliteDatabase
from app.db.select_db import select_db
from app.schemas.base import DefaultModel

translator = Translator()

# SQLAlchemy model representing the object
ModelT = TypeVar("ModelT", bound=Base)
# Pydantic validation schema for creating the object
CreateSchemaT = TypeVar("CreateSchemaT", bound=DefaultModel)
# Pydantic validation schema for updating the object
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=DefaultModel)


def patch_timezone_sqlite(obj: ModelT) -> ModelT:
    """
    Patch the timezone of a datetime object to UTC.
    If the database is not SQLite, the object is returned unchanged.

    :param obj: The object to patch
    :return: The patched object
    """
    if not isinstance(select_db(), SqliteDatabase):
        return obj

    for attr in dir(obj):
        if not attr.startswith("_"):
            value = getattr(obj, attr)
            if isinstance(value, datetime):
                setattr(obj, attr, value.replace(tzinfo=timezone.utc))
    return obj


def apply_distinct(
    query: Select[Tuple[ModelT]], distinct: InstrumentedAttribute[Any] | None
) -> Select[Tuple[ModelT]]:
    """
    Apply a distinct clause to a query.
    With SQLite, the distinct clause is applied using the group_by method, while with
    PostgreSQL, the distinct clause is applied using the distinct method.

    :param query: The query to apply the distinct clause to
    :param distinct: The column to apply the distinct clause to
    :return: The query with the distinct clause applied
    """
    if distinct is not None:
        if isinstance(select_db(), SqliteDatabase):
            query = query.group_by(distinct)
        else:
            query = query.distinct(distinct)  # pragma: no cover
    return query


class CRUDBase(
    Generic[
        ModelT,
        CreateSchemaT,
        UpdateSchemaT,
    ]
):
    def __init__(self, model: Type[ModelT]):
        """
        CRUD object with default methods to Create, Read, Update and Delete.

        :param model: A SQLAlchemy model class
        """
        super().__init__()
        self.model = model

    async def read(
        self, db: AsyncSession, id: Any, for_update: bool = False
    ) -> ModelT | None:
        """
        Get a record by id.

        :param db: The database session
        :param id: The record id
        :param for_update: Whether to lock the record for update

        :return: The record
        """
        obj = await db.get(self.model, id, with_for_update=for_update)
        return patch_timezone_sqlite(obj) if obj else None

    async def query(
        self,
        db: AsyncSession,
        distinct: InstrumentedAttribute[Any] | None = None,
        skip: int = 0,
        limit: int | None = 100,
        **filters,
    ) -> Sequence[ModelT]:
        """
        Get multiple records with filters and distinct option.

        :param db: The database session
        :param distinct: The distinct option, specify the column name
        :param skip: The number of records to skip
        :param limit: The number of records to return
        :param filters: The filters, should be in the form of {column_name: value}

        :return: The list of records
        """

        # The function first creates a query object using the db.query method, and then
        # iterates over the filters to apply them to the query using the query.filter method.
        # The query.distinct method is used to apply the DISTINCT option if specified, and
        # the query.offset and query.limit methods are used to apply the skip and
        # limit parameters. Finally, the query.all method is used to execute the query and
        # return the results as a list of records.

        query = select(self.model)

        for column, value in filters.items():
            if isinstance(
                value, dict
            ):  # Check whether the value of the filter is a dictionary
                for (
                    operator,
                    operand,
                ) in (
                    value.items()
                ):  # Iterate over the items in the value dictionary, which should contain operator-operand pairs
                    # The operator variable is used to specify the operator to use in the filter
                    # (e.g. > and <), and the operand variable is used as the operand for
                    # the filter. For example, if the value dictionary contained the items {gt: 10},
                    # (the operator comes from the operator module) the filter applied would be column > 10.
                    query = query.where(operator(getattr(self.model, column), operand))
            else:
                query = query.where(getattr(self.model, column) == value)

        query = apply_distinct(query, distinct)

        objs = await db.execute(query.offset(skip).limit(limit))
        return [patch_timezone_sqlite(obj) for obj in objs.scalars().all()]

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaT) -> ModelT:
        """
        Create a new record.

        :param db: The database session
        :param obj_in: The record data

        :return: The created record
        """
        # The jsonable_encoder function is used to convert the Pydantic schema to a dictionary
        # by_alias=False means that the keys of the dictionary will be the same as the field names in
        # the Pydantic schema in order to match the column names in the database
        obj_in_data = obj_in.model_dump()
        # Create a new model instance from the input data
        db_obj = self.model(**obj_in_data)
        # Add the new model instance to the database session
        db.add(db_obj)
        # Commit the session to persist the model instance in the database
        await db.commit()
        # Refresh the model instance to get the default values for the columns
        await db.refresh(db_obj)
        # Return the created model instance
        return patch_timezone_sqlite(db_obj)

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelT,
        obj_in: UpdateSchemaT | dict[str, Any],
    ) -> ModelT:
        """
        Update a record.

        :param db: The database session
        :param db_obj: The record to update
        :param obj_in: The record data

        :return: The updated record
        """
        # If the input data is a dictionary, use it as the update data
        # otherwise encode the input data as a dictionary to get the update data
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # We only want to update the fields that were actually passed in the request.
            update_data = obj_in.model_dump(exclude_unset=True)
            # At this point we have a dict with some None value for non-optional fields, we need to clear them
            for field, value in list(update_data.items()):
                if value is None and not self.model.is_optional(field):
                    del update_data[field]

        # Update the fields of the database object with the corresponding
        # values from the update data
        for field, _ in db_obj.attributes:
            if field in update_data:
                # It means: db_obj.field = update_data[field],
                # i.e. set the value of the field of the database object to the value of the field in the update data
                setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return patch_timezone_sqlite(db_obj)

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def delete(self, db: AsyncSession, *, id: int) -> ModelT | None:
        """
        Delete a record.

        :param db: The database session
        :param id: The record id

        :return: The deleted record
        """
        obj = await db.get(self.model, id)
        await db.delete(obj)
        await db.commit()
        return obj
