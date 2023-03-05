from asyncio import wait_for
from collections.abc import Callable
from fastapi.requests import Request
from fastapi.responses import Response
from fastapi import status
from starlette.background import BackgroundTask
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.translation import Translator


translator = Translator()


class ExceptionMonitorMiddleware(BaseHTTPMiddleware):
    """
    This middleware is used to monitor and handle exceptions that occur during
    the processing of an HTTP request. It allows an alert backend function to be
    called whenever an exception is raised, which can be used to send
    notifications or log the exception for further analysis.

    The middleware also returns a response a status code of 500 (Internal
    Server Error) ans a default error message to the client, while running the alert
    backend function in the background as a `BackgroundTask`.
    """

    def __init__(self, app, alert_backend: Callable[[Exception, dict], None]):
        """
        Initialize the middleware with the given FastAPI app and alert backend
        function.

        :param app: The FastAPI app to which the middleware is being added.
        :param alert_backend: The alert backend function to be called when an exception is raised.
        """
        super().__init__(app)
        self.alert_backend = alert_backend
    
    async def set_body(self, request: Request, body: bytes):
        """
        Set the body of the given request to the given bytes.

        :param request: The request whose body is being set.
        :param body: The bytes to be set as the body of the request.
        """
        async def receive():
            return body

        request._receive = receive

    async def get_body(self, request: Request) -> bytes:
        """
        Get the body of the given request as bytes.

        :param request: The request whose body is being retrieved.
        :return: The body of the request as bytes.
        """
        try:
            body = await wait_for(request.body(), timeout=10) # Wait for the body of the request for 10 seconds
            self.set_body(request, body)
            return body
        except TimeoutError:
            return b'Timeout while retrieving request body'


    async def dispatch(self, request: Request, call_next):
        """
        Dispatch the given request through the middleware chain.

        :param request: The request being dispatched.
        :param call_next: The next middleware in the chain.
        :return: The response from the next middleware in the chain, or a default error response if an exception is raised.
        """
        try:
            return await call_next(request)
        except Exception as e: # An unhanded exception was raised during the processing of the request
            # Get the body of the request as bytes
            body = await self.get_body(request)
            # Create a background task to call the alert backend function with the exception and request details
            task = BackgroundTask(
                self.alert_backend,
                e,
                method=request.method,
                url=request.url,
                headers=request.headers,
                body=body,
            )
            # Return a default error response with the background task
            return Response(
                content=translator.INTERNAL_SERVER_ERROR,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                background=task
            )