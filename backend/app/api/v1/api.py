from fastapi import APIRouter
from importlib import import_module

import app.api.v1.endpoints as endpoints


endpoints_modules = [import_module('app.api.v1.endpoints.' + endpoint) for endpoint in endpoints.__all__]

api_v1_router = APIRouter()


for module in endpoints_modules:
    api_v1_router.include_router(
        module.router,
        prefix="/{prefix}".format(prefix=module.__name__.split('.')[-1]),
    )