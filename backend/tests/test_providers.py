from unittest.mock import MagicMock

import pytest

from providers import ask_model


def test_ask_model_returns_reply_text():
    fake_client = MagicMock()
    fake_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="a real-looking reply"))
    ]

    result = ask_model(fake_client, model="test-model", message="hello")

    assert result == "a real-looking reply"
    fake_client.chat.completions.create.assert_called_once_with(
        model="test-model",
        messages=[{"role": "user", "content": "hello"}],
    )


def test_ask_model_propagates_client_error():
    fake_client = MagicMock()
    fake_client.chat.completions.create.side_effect = ConnectionError(
        "local server not running"
    )

    with pytest.raises(ConnectionError, match="local server not running"):
        ask_model(fake_client, model="test-model", message="hello")