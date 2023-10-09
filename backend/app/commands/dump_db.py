import json
import logging
from typing import Any

from sqlalchemy import inspect

from app.db.base_class import Base
from app.dependencies import get_db

logger = logging.getLogger("app.command")


async def dump_db(output_file: str) -> None:
    logger.info("Creating dump data")

    metadata = Base.metadata
    tables = metadata.sorted_tables

    data: dict[str, dict[str, Any]] = {}
    async with get_db.get_session() as session:
        for table in tables:
            data[table.name] = {}
            data[table.name]["columns"] = [
                column.name for column in inspect(table).columns
            ]
            data[table.name]["data"] = []
            for row in await session.execute(table.select()):
                data[table.name]["data"].append(row.tuple()._asdict())

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)

    logger.info("Dump of data created")
