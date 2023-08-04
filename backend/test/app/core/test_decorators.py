import pytest
from fastapi import HTTPException

from app.core.decorator import handle_exceptions


def test_handle_exceptions_0():
    @handle_exceptions("Something went wrong", ValueError)
    def test_func():
        raise ValueError("Test error")

    with pytest.raises(HTTPException) as exc:
        test_func()

    assert exc.value.status_code == 400


def test_handle_exceptions_1():
    @handle_exceptions("Something went wrong", (ValueError, SyntaxError))
    def test_func():
        raise IndexError("Test error")

    with pytest.raises(IndexError, match="Test error"):
        test_func()
