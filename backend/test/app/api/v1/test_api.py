from fastapi import APIRouter

from app.api.v1.api import api_v1_router
from app.api.v1.endpoints.account import router as account_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.barrel import router as barrel_router
from app.api.v1.endpoints.consumable import router as consumable_router
from app.api.v1.endpoints.consumable_item import router as consumable_item_router
from app.api.v1.endpoints.drink import router as drink_router
from app.api.v1.endpoints.glass import router as glass_router
from app.api.v1.endpoints.out_of_stock import router as out_of_stock_router
from app.api.v1.endpoints.out_of_stock_item import router as out_of_stock_item_router
from app.api.v1.endpoints.transaction import router as transaction_router
from app.api.v1.endpoints.treasury import router as treasury_router


def test_api_v1_router():
    assert isinstance(api_v1_router, APIRouter)


def test_api_v1_router_include_all_router():
    all_routers = [
        account_router,
        auth_router,
        barrel_router,
        consumable_item_router,
        consumable_router,
        drink_router,
        glass_router,
        out_of_stock_item_router,
        out_of_stock_router,
        transaction_router,
        treasury_router,
    ]
    for router in all_routers:
        for route in router.routes:
            assert route in api_v1_router.routes
