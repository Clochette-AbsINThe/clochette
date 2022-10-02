from fastapi import FastAPI, APIRouter

from app.api.v1.api import api_v1_router
from app.core.config import settings


app = FastAPI(
    title="Clochette API",
    openapi_url="{prefix}/openapi.json".format(prefix=settings.API_V1_PREFIX),
)

api_router = APIRouter(
    prefix=settings.API_V1_PREFIX,
)


@api_router.get("/", status_code=200)
def root() -> dict:
    return {
        "msg": "Hello, World!",
    }


app.include_router(api_router)
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
