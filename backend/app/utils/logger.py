""" Logging configuration for the application. """

import logging
import sys
from typing import Optional

from app.core.config import settings

BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE = range(8)

# The background is set with 40 plus the number of the color, and the foreground with 30

# These are the sequences need to get colored ouput
RESET_SEQ = "\033[0m"
COLOR_SEQ = "\033[1;%dm"
BOLD_SEQ = "\033[1m"

COLORS = {
    "WARNING": YELLOW,
    "INFO": GREEN,
    "DEBUG": BLUE,
    "CRITICAL": MAGENTA,
    "ERROR": RED,
}


class ColoredFormatter(logging.Formatter):
    def __init__(self, msg):
        msg = msg.replace("$RESET", RESET_SEQ).replace("$BOLD", BOLD_SEQ)
        logging.Formatter.__init__(self, msg)

    def format(self, record):  # pragma: no cover
        levelname = record.levelname
        if levelname in COLORS:
            levelname_color = (
                COLOR_SEQ % (30 + COLORS[levelname]) + levelname + RESET_SEQ
            )
            record.levelname = levelname_color
        return logging.Formatter.format(self, record)


def setup_logs(
    logger_name: str,
    level=None,
):
    """
    Sets up the logger with the specified logger name and configures it to log to stdout if `to_stdout` is True.
    The logger's log level is set based on the `LOG_LEVEL` value in the application's settings.

    Args:
        logger_name (str): The name of the logger.
        to_stdout (bool, optional): Whether to log to stdout. Defaults to True.
    """
    logger = logging.getLogger(logger_name)

    logger.setLevel(settings.LOG_LEVEL)
    if level:
        logger.setLevel(level)
    format_string = (
        "%(levelname)-18s | %(asctime)s | $BOLD%(name)-25s$RESET | %(message)s"
    )
    color_formatter = ColoredFormatter(format_string)

    configure_stdout_logging(
        logger=logger,
        formatter=color_formatter,
        log_level=settings.LOG_LEVEL,
    )


def configure_stdout_logging(
    logger: logging.Logger,
    formatter: Optional[logging.Formatter] = None,
    log_level: int = logging.DEBUG,
):
    """
    Configures the logger to log to stdout with the specified logger, formatter and log level.

    Args:
        logger (Optional[logging.Logger], optional): The logger to configure. Defaults to None.
        formatter (Optional[logging.Formatter], optional): The formatter to use. Defaults to None.
        log_level (str, optional): The log level to use. Defaults to "DEV".
    """
    stream_handler = logging.StreamHandler(stream=sys.stdout)

    stream_handler.setFormatter(formatter)
    stream_handler.setLevel(log_level)

    logger.handlers = []
    logger.addHandler(stream_handler)
