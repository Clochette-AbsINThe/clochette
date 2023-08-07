import datetime
import json
import logging

from sqlalchemy import inspect

from app.db.base_class import Base
from app.dependencies import get_db

logger = logging.getLogger("app.command")


async def load_db(input_file: str) -> None:
    logger.info("Loading dump data")

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with get_db.get_session() as session:
        # Retreive the data from the dump file and load it into the database
        # The data needs to be loaded in the reverse order of the dump file
        # to avoid foreign key constraint errors
        tables = Base.metadata.sorted_tables
        tables_to_load = []
        for table in reversed(tables):
            table_name = table.name
            if table_name not in data:
                logger.error(f"Table {table_name} not in dump file")
                continue
            table_data = data[table_name]
            columns = table_data["columns"]
            rows = table_data["data"]

            # Verify that the columns in the dump file match the columns in the table
            if columns != [column.name for column in inspect(table).columns]:
                logger.error(
                    f"Columns in dump file do not match columns in table {table_name}"
                )
                continue
            tables_to_load.append((table, rows))

        logger.info("Deleting data from tables")
        for table, _ in tables_to_load:
            await session.execute(table.delete())

        for table, rows in reversed(tables_to_load):
            logger.info(f"Loading data for table {table.name}")
            for row in rows:
                # Convert datetime strings to datetime objects
                for column in table.columns:
                    if (
                        isinstance(row[column.name], str)
                        and column.type.python_type == datetime.datetime
                    ):
                        row[column.name] = datetime.datetime.fromisoformat(
                            row[column.name]
                        )
                await session.execute(table.insert().values(**row))

        await session.commit()

    logger.info("Dump of data loaded")
