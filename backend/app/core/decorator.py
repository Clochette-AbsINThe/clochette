import functools
import logging
from typing import Tuple, Type

from fastapi import HTTPException, status

from app.core.translation import Translator

logger = logging.getLogger("app.core.decorator")


def handle_exceptions(
    detail: str | Translator.TranslatedString,
    exceptions: Tuple[Type[Exception], ...] | Type[Exception],
    sync_func: bool = False,
):
    """
    Decorator to handle exceptions and return a custom error message.

    :param detail: The error message
    :param exceptions: The exceptions to handle

    :return: The decorated function
    """

    def decorator(func):
        if sync_func:

            @functools.wraps(
                func
            )  # This is needed to preserve the original function name
            def sync_wrapper(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    logger.error(e)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, detail=detail
                    ) from e

            return sync_wrapper
        else:

            @functools.wraps(
                func
            )  # This is needed to preserve the original function name
            async def async_wrapper(*args, **kwargs):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    logger.error(e)
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, detail=detail
                    ) from e

            return async_wrapper

    return decorator
