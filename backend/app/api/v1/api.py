from fastapi import APIRouter, Depends
from importlib import import_module

import app.api.v1.endpoints as endpoints
from app.dependencies import get_current_account

endpoints_modules = [import_module('app.api.v1.endpoints.' + endpoint) for endpoint in endpoints.__all__]

api_v1_router = APIRouter()

for module in endpoints_modules:
    if getattr(module, 'AUTHENTICATION_REQUIRED', None):
        api_v1_router.include_router(
            module.router,
            prefix="/{prefix}".format(prefix=module.__name__.split('.')[-1]),
            dependencies=[Depends(get_current_account)] , # Protect all endpoints by default
        )
    else:
        api_v1_router.include_router(
            module.router,
            prefix="/{prefix}".format(prefix=module.__name__.split('.')[-1]),
        )