import json
import logging
from traceback import format_exception, print_exception
from typing import Protocol

import requests
from fastapi.datastructures import URL, Headers

from app.core.config import settings

logger = logging.getLogger("app.core.utils.backend.alert_backend")


class TestException(Exception):
    pass


class Alert(Protocol):  # pragma: no cover
    def __call__(
        self, exception: Exception, method: str, url: URL, headers: Headers, body: bytes
    ) -> None:
        ...


def alert_backend() -> Alert:
    if settings.ALERT_BACKEND == "terminal":
        return alert_to_terminal

    if settings.ALERT_BACKEND == "github":
        return alert_to_github_issues

    logger.warning(f"Invalid alert backend: {settings.ALERT_BACKEND}")
    logger.warning("Falling back to terminal alert")
    return alert_to_terminal


def alert_to_terminal(
    exception: Exception, method: str, url: URL, headers: Headers, body: bytes
) -> None:
    if (
        isinstance(exception, TestException) and settings.ENVIRONMENT == "production"
    ):  # pragma: no cover
        return None

    logger.error("### An exception has been raised! ###")
    logger.error("############## Request ##############")
    logger.error(f"{method} {url}")
    logger.error("########## Request headers ##########")
    for key, value in headers.items():
        logger.error(f"- **{key}**: {value}")
    logger.error("########### Request body ############")
    logger.error(body.decode())
    logger.error("############# Exception #############")
    logger.exception(exception, exc_info=False)
    print_exception(type(exception), exception, exception.__traceback__, chain=False)


def alert_to_github_issues(
    exception: Exception, method: str, url: URL, headers: Headers, body: bytes
) -> None:
    if isinstance(exception, TestException):  # pragma: no cover
        return None

    issue_name = f"{exception.__class__.__name__}: {str(exception)}"
    # Format the exception and request to markdown
    markdown = f"# {issue_name}\n\n"
    markdown += f"{method} {url}\n\n"
    markdown += "## Request headers\n"
    markdown += "\n".join(
        f"- **{key}**: {value}"
        for key, value in headers.items()
        if key != "Authorization"
    )
    markdown += "\n\n"
    markdown += "## Request body\n"
    markdown += "```\n"
    markdown += body.decode()
    markdown += "\n```\n\n"
    markdown += "## Exception traceback\n"
    markdown += "```\n"
    markdown += "".join(
        format_exception(
            type(exception), exception, exception.__traceback__, chain=False
        )
    )
    markdown += "\n```\n\n"

    # Create the issue on github

    # Authenticate with github
    session = requests.Session()
    session.auth = (settings.GITHUB_USER, settings.GITHUB_TOKEN)

    # Before creating it, check if there is already an issue with the same title
    github_url = f"https://api.github.com/repos/{settings.REPOSITORY_OWNER}/{settings.REPOSITORY_NAME}/issues"

    response = session.get(github_url)

    if response.status_code != 200:
        logger.error(f"Failed to get issues from github: {response.status_code}")
        logger.error(response.content)
        logger.warning("Falling back to terminal alert")
        return alert_to_terminal(exception, method, url, headers, body)

    existing_issue = next(
        (issue for issue in response.json() if issue["title"] == issue_name),
        None,
    )

    if existing_issue:
        logger.warning(f"Issue already exists on github: {existing_issue['html_url']}")
        return None

    payload = {
        "title": issue_name,
        "body": body.decode(),
        "labels": [label for label in settings.ISSUE_LABELS.split(",") if label],
    }

    response = session.post(github_url, data=json.dumps(payload))

    if response.status_code != 201:
        logger.error("Failed to create issue on github: {response.status_code}")
        logger.error(response.content)
        logger.warning("Falling back to terminal alert")
        return alert_to_terminal(exception, method, url, headers, body)

    logger.info(f"Issue created on github: {response.json()['html_url']}")
    return None
