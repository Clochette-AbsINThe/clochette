from collections.abc import Callable
from fastapi.requests import Request
from fastapi.responses import Response
from fastapi import status
from starlette.background import BackgroundTask
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.translation import Translator


translator = Translator()


class ExceptionMonitorMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, alert_backend: Callable[[Exception, dict], None]):
        super().__init__(app)
        self.alert_backend = alert_backend
    
    async def set_body(self, request: Request, body: bytes):
        async def receive():
            return body

        request._receive = receive

    async def get_body(self, request: Request) -> bytes:
        body = await request.body()
        self.set_body(request, body)
        return body


    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            body = await self.get_body(request)
            print(type(self.alert_backend))
            task = BackgroundTask(
                self.alert_backend,
                e,
                method=request.method,
                url=request.url,
                headers=request.headers,
                body=body,
            )
            return Response(
                content=translator.INTERNAL_SERVER_ERROR,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                background=task
            )