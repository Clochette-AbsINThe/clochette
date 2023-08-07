from typing import Generator

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client() -> Generator:
    yield TestClient(app)
