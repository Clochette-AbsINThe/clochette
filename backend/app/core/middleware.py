import logging

from fastapi import status
from fastapi.requests import Request
from fastapi.responses import Response
from starlette.background import BackgroundTask
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.translation import Translator
from app.core.utils.backend.alert_backend import Alert

translator = Translator()

logger = logging.getLogger("app.core.middleware")


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

    def __init__(self, app, alert_backend: Alert):
        """
        Initialize the middleware with the given FastAPI app and alert backend
        function.

        :param app: The FastAPI app to which the middleware is being added.
        :param alert_backend: The alert backend function to be called when an exception is raised.
        """
        super().__init__(app)
        self.alert_backend = alert_backend

    async def dispatch(self, request: Request, call_next):
        """
        Dispatch the given request through the middleware chain.

        :param request: The request being dispatched.
        :param call_next: The next middleware in the chain.
        :return: The response from the next middleware in the chain,
        or a default error response if an exception is raised.
        """
        try:
            body: bytes = await request.body()
            return await call_next(request)
        # An unhanded exception was raised during the processing of the request
        except Exception as e:
            logger.debug(
                "Exception raised during processing of request %s %s: %s",
                request.method,
                request.url,
                e,
            )
            # Create a background task to call the alert backend function with the exception and request details
            task = BackgroundTask(
                self.alert_backend,
                exception=e,
                method=request.method,
                url=request.url,
                headers=request.headers,
                body=body,
            )
            # Return a default error response with the background task
            return Response(
                content=translator.INTERNAL_SERVER_ERROR,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                background=task,
            )
