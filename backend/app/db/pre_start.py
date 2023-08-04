import logging
import signal
import sys
import traceback

from sqlalchemy import select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.dependencies import get_db

MAX_TRIES = 30  # 30 seconds
WAIT_SECONDS = 1

logger = logging.getLogger("app.db.pre_start")


# This logic is used to be able to quit the app with CTRL+C when running
# the function with retry
def handle_sigint(signum, frame):
    if RAISED_EXCEPTION:  # pragma: no cover
        traceback.print_exception(
            type(RAISED_EXCEPTION), RAISED_EXCEPTION, RAISED_EXCEPTION.__traceback__
        )
    sys.exit(0)


RAISED_EXCEPTION = None


@retry(
    stop=stop_after_attempt(MAX_TRIES),
    wait=wait_fixed(WAIT_SECONDS),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
async def pre_start() -> None:
    """
    Checks if the database is awake and ready to accept connections.
    """
    signal.signal(signal.SIGINT, handle_sigint)
    try:
        async with get_db.get_session() as db:
            await db.execute(select(1))

        logger.info("Database is ready to accept connections")
        signal.signal(signal.SIGINT, signal.SIG_DFL)
    except Exception as e:
        global RAISED_EXCEPTION
        RAISED_EXCEPTION = e
        logger.error(e)
        raise e
