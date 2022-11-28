from dataclasses import dataclass

from app.core.config import settings


SUPPORTED_LOCALES = ["en", "fr"]


@dataclass
class Translator:
    """ Class to manage the translation of the messages. """

    class TranslatedString:
        """ Class to manage the translation of a single string. """
        def __init__(self, strings: dict[str, str]):
            # Check if locales are supported
            for locale in strings:
                if locale not in SUPPORTED_LOCALES:
                    raise ValueError(f"Locale '{locale}' is not supported.")
            self._strings: dict[str, str] = strings
            self._element: str | None = None

        def __str__(self) -> str:
            """ Return the string corresponding to the current locale. """
            if self._element is None:
                return self._strings[settings.LOCALE].capitalize()
            return self._strings[settings.LOCALE].format(element=self._element).capitalize()
    
    def __init__(self, element: str | None = None):
        super().__init__()
        self._element = element
    
    # Define the messages here
    ELEMENT_NOT_FOUND: TranslatedString = TranslatedString({
        "en": "Element not found" if format is None else "Element {element} not found",
        "fr": "Élément introuvable" if format is None else "Élément {element} introuvable"
    })

    ELEMENT_ALREADY_EXISTS: TranslatedString = TranslatedString({
        "en": "Element already exists" if format is None else "Element {element} already exists",
        "fr": "Élément déjà existant" if format is None else "Élément {element} déjà existant"
    })

    INVALID_CREDENTIALS: TranslatedString = TranslatedString({
        "en": "Invalid credentials",
        "fr": "Identifiants invalides"
    })

    INTEGRITY_ERROR: TranslatedString = TranslatedString({
        "en": "Data relationship integrity error",
        "fr": "Erreur d'intégrité des données"
    })

    DELETION_OF_USED_ELEMENT: TranslatedString = TranslatedString({
        "en": "Element is in use and cannot be deleted" if format is None else "Element {element} is in use and cannot be deleted",
        "fr": "L'élément est utilisé et ne peut pas être supprimé" if format is None else "L'élément {element} est utilisé et ne peut pas être supprimé"
    })

    NEGATIVE_CASH_AMOUNT: TranslatedString = TranslatedString({
        "en": "Cash amount cannot be negative",
        "fr": "Le montant en espèces ne peut pas être négatif"
    })

    INTERNAL_SERVER_ERROR: TranslatedString = TranslatedString({
        "en": "Internal server error, administrator has been notified",
        "fr": "Erreur interne du serveur, l'administrateur a été notifié"
    })

    def __getattribute__(self, __name: str) -> str:
        """ Get the translated string. """
        attr = super().__getattribute__(__name)
        if isinstance(attr, Translator.TranslatedString):
            attr._element = self._element
            return str(attr)
        return attr
