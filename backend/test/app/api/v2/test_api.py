from fastapi import APIRouter

from app.api.v2.api import api_v2_router
from app.api.v2.endpoints.barrel import router as barrel_router
from app.api.v2.endpoints.consumable import router as consumable_item_router
from app.api.v2.endpoints.glass import router as glass_router
from app.api.v2.endpoints.non_inventoried_item import (
    router as non_inventoried_item_router,
)
from app.api.v2.endpoints.transaction import router as transaction_router


def test_api_v2_router():
    assert isinstance(api_v2_router, APIRouter)


def test_api_v1_router_include_all_router():
    all_routers = [
        barrel_router,
        consumable_item_router,
        glass_router,
        non_inventoried_item_router,
        transaction_router,
    ]
    for router in all_routers:
        for route in router.routes:
            assert route in api_v2_router.routes
