import logging

from sqlalchemy import text

from app.dependencies import get_db

logger = logging.getLogger("app.command")


async def execute_sql_command(command: str) -> None:
    logger.info(f"Executing SQL command, {command}")
    async with get_db.get_session() as session:
        result = await session.execute(text(command))
        logger.info(result.all())
