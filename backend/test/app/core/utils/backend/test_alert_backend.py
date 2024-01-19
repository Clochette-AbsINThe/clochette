import json
from unittest.mock import MagicMock, patch

from fastapi.datastructures import URL, Headers

from app.core.config import settings
from app.core.utils.backend.alert_backend import alert_backend, alert_to_terminal


@patch("app.core.config.settings.ALERT_BACKEND", "error")
def test_get_alert_backend_error(caplog):
    alert = alert_backend()

    assert alert == alert_to_terminal
    assert "Invalid alert backend: error" in caplog.text


def test_alert_to_terminal(caplog):
    exception = ValueError("Test error")
    method = "GET"
    url = URL("https://example.com")
    headers = Headers({"content-type": "application/json"})
    body = b'{"test": "data"}'

    alert = alert_backend()
    alert(exception, method, url, headers, body)

    assert "An exception has been raised!" in caplog.text
    assert f"{method} {url}" in caplog.text
    assert "- **content-type**: application/json" in caplog.text
    assert "test" in caplog.text
    assert "Test error" in caplog.text


@patch("app.core.config.settings.ALERT_BACKEND", "github")
def test_alert_to_github_issues_existing():
    exception = ValueError("Test exception")
    method = "GET"
    url = URL("https://example.com")
    headers = Headers({"Content-Type": "application/json"})
    body = b'{"test": "data"}'

    alert = alert_backend()

    with patch("requests.Session") as mock_session:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "title": f"{exception.__class__.__name__}: {str(exception)}",
                "html_url": "https://example.com",
            }
        ]
        mock_session.return_value.get.return_value = mock_response

        alert(exception, method, url, headers, body)

        mock_session.assert_called_once_with()
        assert mock_session.return_value.auth == (
            settings.GITHUB_USER,
            settings.GITHUB_TOKEN,
        )
        mock_session.return_value.get.assert_called_once_with(
            f"https://api.github.com/repos/{settings.REPOSITORY_OWNER}/{settings.REPOSITORY_NAME}/issues"
        )
        mock_session.return_value.post.assert_not_called()


@patch("app.core.config.settings.ALERT_BACKEND", "github")
def test_alert_to_github_issues_existing_error(caplog):
    exception = ValueError("Test exception")
    method = "GET"
    url = URL("https://example.com")
    headers = Headers({"Content-Type": "application/json"})
    body = b'{"test": "data"}'

    alert = alert_backend()

    with patch("requests.Session") as mock_session:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.json.return_value = {}
        mock_session.return_value.get.return_value = mock_response

        alert(exception, method, url, headers, body)

        assert "Failed to get issues from github" in caplog.text


@patch("app.core.config.settings.ALERT_BACKEND", "github")
def test_alert_to_github_issues_new():
    exception = ValueError("Test exception")
    method = "GET"
    url = URL("https://example.com")
    headers = Headers({"Content-Type": "application/json"})
    body = b'{"test": "data"}'

    alert = alert_backend()

    with patch("requests.Session") as mock_session:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = []
        mock_session.return_value.get.return_value = mock_response
        mock_session.return_value.post.return_value.status_code = 201
        mock_session.return_value.post.return_value.json.return_value = {
            "html_url": "https://example.com"
        }

        alert(exception, method, url, headers, body)

        mock_session.assert_called_once_with()
        assert mock_session.return_value.auth == (
            (settings.GITHUB_USER, settings.GITHUB_TOKEN)
        )
        mock_session.return_value.get.assert_called_once_with(
            f"https://api.github.com/repos/{settings.REPOSITORY_OWNER}/{settings.REPOSITORY_NAME}/issues"
        )
        mock_session.return_value.post.assert_called_once_with(
            f"https://api.github.com/repos/{settings.REPOSITORY_OWNER}/{settings.REPOSITORY_NAME}/issues",
            data=json.dumps(
                {
                    "title": f"{exception.__class__.__name__}: {str(exception)}",
                    "body": body.decode(),
                    "labels": [
                        label for label in settings.ISSUE_LABELS.split(",") if label
                    ],
                }
            ),
        )


@patch("app.core.config.settings.ALERT_BACKEND", "github")
def test_alert_to_github_issues_new_error(caplog):
    exception = ValueError("Test exception")
    method = "GET"
    url = URL("https://example.com")
    headers = Headers({"Content-Type": "application/json"})
    body = b'{"test": "data"}'

    alert = alert_backend()

    with patch("requests.Session") as mock_session:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = []
        mock_session.return_value.get.return_value = mock_response
        mock_session.return_value.post.return_value.status_code = 500
        mock_session.return_value.post.return_value.json.return_value = {}

        alert(exception, method, url, headers, body)

        assert "Failed to create issue on github" in caplog.text
