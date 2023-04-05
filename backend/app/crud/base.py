from datetime import datetime
from typing import Any, Generic, Optional, Type, TypeVar

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.expression import select, Select

from app.core.decorator import handle_exceptions
from app.core.translation import Translator
from app.core.types import SynchronizedClass
from app.db.base_class import Base


translator = Translator()

# SQLAlchemy model representing the object
ModelType = TypeVar("ModelType", bound=Base)
# Pydantic validation schema for creating the object
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
# Pydantic validation schema for updating the object
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(
    Generic[
        ModelType,
        CreateSchemaType,
        UpdateSchemaType,
    ],
    SynchronizedClass
):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update and Delete.

        :param model: A SQLAlchemy model class
        """
        super().__init__()
        self.model = model

    async def read(self, db: AsyncSession, id: Any, for_update: bool = False) -> Optional[ModelType]:
        """
        Get a record by id.

        :param db: The database session
        :param id: The record id
        :param for_update: Whether to lock the record for update

        :return: The record
        """
        return await db.get(self.model, id, with_for_update=for_update)

    async def query(self, db: AsyncSession, distinct: str | None = None, skip: int = 0, limit: int = 100, **filters) -> list[ModelType]:
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

        query: Select = select(self.model)

        for column, value in filters.items():
            if isinstance(value, dict):  # Check whether the value of the filter is a dictionary
                for operator, operand in value.items():  # Iterate over the items in the value dictionary, which should contain operator-operand pairs
                    # The operator variable is used to specify the operator to use in the filter
                    # (e.g. > and <), and the operand variable is used as the operand for
                    # the filter. For example, if the value dictionary contained the items {gt: 10},
                    # (the operator comes from the operator module) the filter applied would be column > 10.
                    query = query.where(
                        operator(getattr(self.model, column), operand))
            else:
                query = query.where(getattr(self.model, column) == value)

        if distinct:
            # Apply the DISTINCT option if specified
            query = query.distinct(distinct)

        return (await db.execute(query.offset(skip).limit(limit))).scalars().all()

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def create(self, db: AsyncSession, *, obj_in: CreateSchemaType) -> ModelType:
        """
        Create a new record.

        :param db: The database session
        :param obj_in: The record data

        :return: The created record
        """
        # The jsonable_encoder function is used to convert the Pydantic schema to a dictionary
        obj_in_data = jsonable_encoder(
            obj_in,
            by_alias=False,  # by_alias=False means that the keys of the dictionary will be the same as the field names in the Pydantic schema in order to match the column names in the database
            custom_encoder={
                # Do not convert datetime objects to strings
                datetime: lambda v: v,
            }
        )
        # Create a new model instance from the input data
        db_obj = self.model(**obj_in_data)
        # Add the new model instance to the database session
        db.add(db_obj)
        # Commit the session to persist the model instance in the database
        await db.commit()
        # Return the created model instance
        return db_obj

    @handle_exceptions(translator.INTEGRITY_ERROR, IntegrityError)
    async def update(self, db: AsyncSession, *, db_obj: ModelType, obj_in: UpdateSchemaType | dict[str, Any]) -> ModelType:
        """
        Update a record.

        :param db: The database session
        :param db_obj: The record to update
        :param obj_in: The record data

        :return: The updated record
        """
        # Encode the database object as a dictionary
        obj_data = jsonable_encoder(
            db_obj,
            custom_encoder={
                # Do not convert datetime objects to strings
                datetime: lambda v: v,
            }
        )
        # If the input data is a dictionary, use it as the update data
        # otherwise encode the input data as a dictionary to get the update data
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # exclude_unset=True means that only the fields that are explicitly set in the input data will be updated
            update_data = obj_in.dict(exclude_unset=True)

        # Update the fields of the database object with the corresponding
        # values from the update data
        for field in obj_data:
            if field in update_data:
                # It means: db_obj.field = update_data[field],
                # i.e. set the value of the field of the database object to the value of the field in the update data
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.commit()
        return db_obj

    async def delete(self, db: AsyncSession, *, id: int) -> ModelType:
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
