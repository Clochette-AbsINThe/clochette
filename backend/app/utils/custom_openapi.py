import json
import re
from typing import Any, Callable, Dict

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi


def replace_schema_names(input_data: dict[str, Any]) -> dict[str, Any]:
    """
    Replace the schema names in the input data.

    :param input_data: The input data
    :return: The input data with the schema names replaced
    """
    input_string = json.dumps(input_data)
    patterns = [
        (r"app__schemas__(?!v2)(\w+)__(\w+)", r"\2V1"),
        (r"app__schemas__v2__(\w+)__(\w+)", r"\2"),
    ]

    for pattern, replacement in patterns:
        input_string = re.sub(pattern, replacement, input_string)

    return json.loads(input_string)


def generate_custom_openapi(app: FastAPI) -> Callable[[], Dict[str, Any]]:
    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title=app.title,
            version=app.version,
            routes=app.routes,
        )

        openapi_schema = replace_schema_names(openapi_schema)

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    return custom_openapi
