from fastapi import APIRouter

from app.core.utils.backend.alert_backend import TestException
from app.utils.get_version import get_version

base_router = APIRouter(tags=["Utils"])


@base_router.get("/", status_code=200)
async def root() -> dict[str, str]:
    """
    Root endpoint.
    """
    return {"msg": "Hello, World!"}


@base_router.get("/health", status_code=200)
async def health() -> dict[str, str]:
    """
    Health endpoint.
    """
    return {"status": "OK"}


@base_router.get("/error", status_code=500)
async def error():
    """
    Error endpoint, which need to be used to test the exception monitor middleware.
    """
    raise TestException("Test exception")


@base_router.get("/version", status_code=200)
async def version() -> dict[str, str]:
    """
    Version endpoint.
    """
    return {"version": get_version()}
