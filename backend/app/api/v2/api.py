from fastapi import APIRouter

from app.api.v2 import endpoints
from app.utils.load_submodules import load_submodules

endpoints_modules = load_submodules(endpoints)

api_v2_router = APIRouter()


for module in endpoints_modules:
    api_v2_router.include_router(module.router)
