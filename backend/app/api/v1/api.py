from fastapi import APIRouter

from app.api.v1 import endpoints
from app.utils.load_submodules import load_submodules

endpoints_modules = load_submodules(endpoints)

api_v1_router = APIRouter()


for module in endpoints_modules:
    api_v1_router.include_router(module.router)
