from unittest.mock import mock_open, patch

from app.utils.get_version import get_version


def test_get_version():
    with patch("builtins.open", mock_open(read_data=b'[tool.poetry]\nversion = "1.2.3"')):
        assert get_version() == "1.2.3"
    with patch("builtins.open", mock_open(read_data=b'[tool.poetry]\nversion = "4.5.6"')):
        assert get_version() == "4.5.6"
