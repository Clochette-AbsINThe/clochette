from collections.abc import Callable
from devtools import pprint
from traceback import format_exception

from app.core.config import settings


def alert_backend() -> Callable[[Exception, dict], None]:
    if settings.ALERT_BACKEND == "terminal":
        return alert_to_terminal
    elif settings.ALERT_BACKEND == "github":
        return alert_to_github_issues
    else:
        print("Invalid alert backend: {backend}".format(
            backend=settings.ALERT_BACKEND
        ))
        print("Falling back to terminal alert")
        return alert_to_terminal


def alert_to_terminal(exception: Exception, **request: dict) -> None:
    print("### An exception has been raised! ###")
    print("############## Request ##############")
    pprint(request)
    print("############# Exception #############")
    format_exception(type(exception), exception, exception.__traceback__)
    pprint(exception)


def alert_to_github_issues(exception: Exception, **request: dict) -> None:
    # Format the exception and request to markdown
    body = "# {type}: {msg}\n\n".format(
        type=exception.__class__.__name__,
        msg=str(exception)
    )
    body += "{method} {url}\n\n".format(
        method=request["method"],
        url=request["url"]
    )
    body += "## Request headers\n"
    body += "\n".join(
        "- **{key}**: {value}".format(
            key=key,
            value=value
        )
        for key, value in request["headers"].items()
    )
    body += "\n\n"
    body += "## Request body\n"
    body += "```\n"
    body += request["body"].decode()
    body += "\n```\n\n"
    body += "## Exception traceback\n"
    body += "```\n"
    body += "".join(format_exception(type(exception), exception, exception.__traceback__))
    body += "\n```\n\n"

    # Create the issue on github
    import requests
    import json

    # Authenticate with github
    session = requests.Session()
    session.auth = (settings.GITHUB_USER, settings.GITHUB_TOKEN)

    # Before creating it, check if there is already an issue with the same title
    url = "https://api.github.com/repos/{owner}/{repo}/issues".format(
        owner=settings.REPOSITORY_OWNER,
        repo=settings.REPOSITORY_NAME
    )

    response = session.get(url)

    if response.status_code != 200:
        print("Failed to get issues from github: {status_code}".format(
            status_code=response.status_code
        ))
        print(response.content)
        print("Falling back to terminal alert")
        alert_to_terminal(exception, **request)
        return

    existing_issue = next(
        (
            issue
            for issue in response.json()
            if issue["title"] == "{type}: {msg}".format(
                type=exception.__class__.__name__,
                msg=str(exception)
            )
        ),
        None
    )

    if existing_issue:
        print("Issue already exists on github: {url}".format(
            url=existing_issue["html_url"]
        ))
        return

    # Create the issue

    url = "https://api.github.com/repos/{owner}/{repo}/issues".format(
        owner=settings.REPOSITORY_OWNER,
        repo=settings.REPOSITORY_NAME
    )

    payload = {
        "title": "{type}: {msg}".format(
            type=exception.__class__.__name__,
            msg=str(exception)
        ),
        "body": body,
        "labels": [label for label in settings.ISSUE_LABELS.split(",") if label],
    }

    response = session.post(url, data=json.dumps(payload))

    if response.status_code != 201:
        print("Failed to create issue on github: {status_code}".format(
            status_code=response.status_code
        ))
        print(response.content)
        print("Falling back to terminal alert")
        alert_to_terminal(exception, **request)
    else:
        print("Issue created on github: {url}".format(
            url=response.json()["html_url"]
        ))