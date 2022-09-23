from fastapi import FastAPI, APIRouter


app = FastAPI(
    title="Clochette API",
    openapi_url="/openapi.json",
)

api_router = APIRouter(
    prefix="/api",
)


@api_router.get("/", status_code=200)
def root() -> dict:
    return {
        "msg": "Hello, World!",
    }


app.include_router(api_router)
