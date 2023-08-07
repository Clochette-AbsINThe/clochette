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
        for table_name, table_data in data.items():
            table = Base.metadata.tables[table_name]
            columns = table_data["columns"]
            rows = table_data["data"]

            # Verify that the columns in the dump file match the columns in the table
            if columns != [column.name for column in inspect(table).columns]:
                logger.error(
                    f"Columns in dump file do not match columns in table {table_name}"
                )
                continue
            logger.info(f"Loading data for table {table_name}")
            await session.execute(table.delete())
            for row in rows:
                await session.execute(table.insert().values(**row))

    logger.info("Dump of data loaded")
