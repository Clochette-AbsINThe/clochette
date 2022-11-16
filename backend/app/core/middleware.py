from fastapi.requests import Request
from starlette.middleware.base import BaseHTTPMiddleware


class ExceptionMonitorMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, alert_backend: callable):
        super().__init__(app)
        self.alert_backend = alert_backend
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
        except Exception as e:
            self.alert_backend(request, e)
            raise e
        return response