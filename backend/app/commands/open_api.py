import json
import logging
from pathlib import Path

from app.main import app

logger = logging.getLogger("app.commands.open_api")


def open_api(output: str):
    """
    Generate OpenAPI schema.
    """
    with Path(output).open("w", encoding="utf-8") as f:
        logger.info("Writing OpenAPI schema to %s", output)
        text: str = json.dumps(app.openapi(), indent=2)
        f.write(text)
