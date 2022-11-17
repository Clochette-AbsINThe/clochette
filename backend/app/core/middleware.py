from fastapi.requests import Request
from fastapi.responses import Response
from fastapi import status
from starlette.middleware.base import BaseHTTPMiddleware


class ExceptionMonitorMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, alert_backend: callable):
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
            self.alert_backend(
                exception=e,
                method=request.method,
                url=request.url,
                headers=request.headers,
                body=body,
            )
        return Response(
            "Internal Server Error, administrator has been notified",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )