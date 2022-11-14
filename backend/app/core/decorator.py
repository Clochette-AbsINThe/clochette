import functools

from fastapi import HTTPException, status


def handle_exceptions(detail, *exceptions):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            e = None
            try:
                return func(*args, **kwargs)
            except exceptions or Exception as e:
                print(e)  # TODO: Remove when email alert middleware is implemented #24
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{detail}')
        return wrapper
    return decorator