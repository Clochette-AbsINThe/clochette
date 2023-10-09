import logging
from typing import Generator

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.utils.logger import setup_logs

setup_logs("app", logging.DEBUG)


@pytest.fixture(scope="module")
def client() -> Generator:
    yield TestClient(app)
