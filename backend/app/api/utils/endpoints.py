from fastapi import APIRouter

from app.core.utils.backend.alert_backend import TestException
from app.schemas.utils_endpoints import HealthResponse, RootResponse, VersionResponse
from app.utils.get_version import get_version

base_router = APIRouter(tags=["Utils"])


@base_router.get("/", status_code=200, response_model=RootResponse)
async def root():
    """
    Root endpoint.
    """
    return {"msg": "Hello, World!"}


@base_router.get("/health", status_code=200, response_model=HealthResponse)
async def health():
    """
    Health endpoint.
    """
    return {"status": "OK"}


@base_router.get("/error", status_code=500)
async def error():
    """
    Error endpoint, which need to be used to test the exception monitor middleware.
    """
    msg = "Test exception"
    raise TestException(msg)


@base_router.get("/version", status_code=200, response_model=VersionResponse)
async def version():
    """
    Version endpoint.
    """
    return {"version": get_version()}
