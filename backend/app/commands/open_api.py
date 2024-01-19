import json
import logging

from app.main import app

logger = logging.getLogger("app.commands.open_api")


def open_api(output: str):
    """
    Generate OpenAPI schema.
    """
    with open(output, "w", encoding="utf-8") as f:
        logger.info(f"Writing OpenAPI schema to {output}")
        text: str = json.dumps(app.openapi(), indent=2)
        f.write(text)
