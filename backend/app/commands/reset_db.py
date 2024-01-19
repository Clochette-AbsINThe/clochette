import logging

from app.dependencies import get_db

logger = logging.getLogger("app.command")


async def reset_db() -> None:
    logger.info("Resetting database")
    await get_db.drop()
    logger.info("Database reset")
