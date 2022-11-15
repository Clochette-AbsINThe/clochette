import functools

from fastapi import HTTPException, status


def handle_exceptions(detail, *exceptions):
    """
    Decorator to handle exceptions and return a custom error message.

    :param detail: The error message
    :param exceptions: The exceptions to handle

    :return: The decorated function
    """

    def decorator(func):
        @functools.wraps(func) # This is needed to preserve the original function name
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except exceptions or Exception as e:
                print(e)  # TODO: Remove when email alert middleware is implemented #24
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{detail}')
        return wrapper
    return decorator