from unittest.mock import patch

from app.core.translation import Translator


@patch("app.core.translation.settings.LOCALE", "fr")
def test_translator_fr():
    translator = Translator()
    assert str(translator.ELEMENT_NOT_FOUND) == "Élément introuvable"


@patch("app.core.translation.settings.LOCALE", "en")
def test_translator_en():
    translator = Translator()
    assert str(translator.ELEMENT_NOT_FOUND) == "Element not found"


@patch("app.core.translation.settings.LOCALE", "en")
def test_translated_string_element():
    translator = Translator(element="test")
    assert str(translator.ELEMENT_NOT_FOUND) == "Test not found"
