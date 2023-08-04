import signal
from unittest.mock import AsyncMock, patch

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import RetryError

from app.db.pre_start import handle_sigint, pre_start


@pytest.mark.asyncio
async def test_pre_start():
    with patch("app.db.pre_start.get_db.get_session") as mock_get_session:
        mock_get_session.return_value = AsyncMock(spec=AsyncSession)
        await pre_start()


@pytest.mark.asyncio
@patch("app.db.pre_start.pre_start.retry.stop.max_attempt_number", 1)
async def test_pre_start_error():
    with patch("app.db.pre_start.get_db.get_session") as mock_get_session:
        mock_get_session.side_effect = Exception("BOOM")
        with pytest.raises(RetryError):
            await pre_start()


def test_handle_sigint():
    with patch("sys.exit") as mock_exit:
        handle_sigint(signal.SIGINT, None)
        mock_exit.assert_called_once_with(0)
