import asyncio

import pytest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient

from app.core.middleware import ExceptionMonitorMiddleware

side_effect_queue: asyncio.Queue[dict] = asyncio.Queue()


def alert_backend(*args, **kwargs):
    side_effect_queue.put_nowait({"args": args, "kwargs": kwargs})


@pytest.mark.asyncio
async def test_exception_monitor_middleware():
    # Define a FastAPI app with the middleware
    app = FastAPI()
    app.add_middleware(ExceptionMonitorMiddleware, alert_backend=alert_backend)

    # Define a test client for the app
    client = TestClient(app)

    # Define a test route that raises an exception
    @app.post("/test")
    async def test_route_post():
        raise Exception("Test exception")

    # Define a test route that does not raise an exception
    @app.post("/test_2")
    async def test_route_get():
        return {"test": "test"}

    # Make a request to the get test route to ensure that the middleware does not
    # affect the response when no exception is raised
    response = client.post("/test_2", json={"test": "test"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"test": "test"}

    # Make a request to the test route
    response = client.post("/test", json={"test": "test"}, headers={"test": "test"})

    # Assert that the response has a status code of 500
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    # Assert that the response content is the default error message
    assert response.content == b"Internal server error"

    # Wait for the alert backend function to be called
    side_effect_data = await side_effect_queue.get()

    # Assert that the alert backend function was called with the expected arguments
    assert side_effect_data["kwargs"]["method"] == "POST"
    assert side_effect_data["kwargs"]["url"] == "http://testserver/test"
    assert side_effect_data["kwargs"]["body"] == b'{"test": "test"}'
    assert side_effect_data["kwargs"]["headers"].get("test") == "test"
