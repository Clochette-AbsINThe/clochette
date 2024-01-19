import pytest
from fastapi import HTTPException

from app.core.decorator import handle_exceptions


def test_handle_exceptions_0():
    @handle_exceptions("Something went wrong", ValueError, True)
    def test_func():
        raise ValueError("Test error")

    with pytest.raises(HTTPException) as exc:
        test_func()

    assert exc.value.status_code == 400


def test_handle_exceptions_1():
    @handle_exceptions("Something went wrong", (ValueError, SyntaxError), True)
    def test_func():
        raise IndexError("Test error")

    with pytest.raises(IndexError, match="Test error"):
        test_func()


@pytest.mark.asyncio
async def test_handle_exceptions_async_0():
    @handle_exceptions("Something went wrong", ValueError)
    async def test_func():
        raise ValueError("Test error")

    with pytest.raises(HTTPException) as exc:
        await test_func()

    assert exc.value.status_code == 400


@pytest.mark.asyncio
async def test_handle_exceptions_async_1():
    @handle_exceptions("Something went wrong", (ValueError, SyntaxError))
    async def test_func():
        raise IndexError("Test error")

    with pytest.raises(IndexError, match="Test error"):
        await test_func()
