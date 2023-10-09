from dataclasses import dataclass

from app.core.config import SupportedLocales, settings

ElementNameMapper: dict[SupportedLocales, str] = {"en": "element", "fr": "élément"}


@dataclass
class Translator:
    """Class to manage the translation of the messages."""

    class TranslatedString:
        """Class to manage the translation of a single string."""

        def __init__(self, strings: dict[SupportedLocales, str]):
            # Check if locales are supported
            self._strings: dict[SupportedLocales, str] = strings
            self._element: str | None = None

        def __str__(self) -> str:
            """Return the string corresponding to the current locale."""
            element = (
                self._element
                if self._element is not None
                else ElementNameMapper[settings.LOCALE]
            )
            return (
                self._strings[settings.LOCALE]
                .format(element=element)
                .replace("_", " ")
                .capitalize()
            )

    def __init__(self, element: str | None = None):
        super().__init__()
        self._element = element

    # Define the messages here
    ELEMENT_NOT_FOUND: TranslatedString = TranslatedString(
        strings={
            "en": "{element} not found",
            "fr": "{element} introuvable",
        }
    )

    ELEMENT_ALREADY_EXISTS: TranslatedString = TranslatedString(
        {
            "en": "{element} already exists",
            "fr": "{element} déjà existant",
        }
    )

    INVALID_CREDENTIALS: TranslatedString = TranslatedString(
        {"en": "Invalid credentials", "fr": "Identifiants invalides"}
    )

    INTEGRITY_ERROR: TranslatedString = TranslatedString(
        {
            "en": "Data relationship integrity error",
            "fr": "Erreur d'intégrité des données",
        }
    )

    DELETION_OF_USED_ELEMENT: TranslatedString = TranslatedString(
        {
            "en": "{element} is in use and cannot be deleted",
            "fr": "{element} est utilisé et ne peut pas être supprimé",
        }
    )

    ELEMENT_NO_LONGER_IN_STOCK: TranslatedString = TranslatedString(
        {
            "en": "{element} is no longer in stock",
            "fr": "{element} n'est plus en stock",
        }
    )

    NEGATIVE_CASH_AMOUNT: TranslatedString = TranslatedString(
        {
            "en": "Cash amount cannot be negative",
            "fr": "Le montant en espèces ne peut pas être négatif",
        }
    )

    INTERNAL_SERVER_ERROR: TranslatedString = TranslatedString(
        {"en": "Internal server error", "fr": "Erreur interne du serveur"}
    )

    AUTHENTICATION_REQUIRED: TranslatedString = TranslatedString(
        {"en": "Authentication required", "fr": "Authentification requise"}
    )

    INSUFFICIENT_PERMISSIONS: TranslatedString = TranslatedString(
        {"en": "Insufficient permissions", "fr": "Permissions insuffisantes"}
    )

    INACTIVE_ACCOUNT: TranslatedString = TranslatedString(
        {"en": "Account is inactive", "fr": "Le compte est inactif"}
    )

    USERNAME_UNAVAILABLE: TranslatedString = TranslatedString(
        {"en": "Username is unavailable", "fr": "Le nom d'utilisateur est indisponible"}
    )

    ALREADY_PENDING_TRANSACTION: TranslatedString = TranslatedString(
        {
            "en": "There is already a pending transaction",
            "fr": "Il y a déjà une transaction en attente",
        }
    )

    TRANSACTION_NOT_PENDING: TranslatedString = TranslatedString(
        {
            "en": "The transaction is not pending",
            "fr": "La transaction n'est pas en attente",
        }
    )

    TRANSACTION_NOT_PURCHASE: TranslatedString = TranslatedString(
        {
            "en": "The transaction is not a purchase",
            "fr": "La transaction n'est pas un achat",
        }
    )

    TRANSACTION_NOT_SALE: TranslatedString = TranslatedString(
        {
            "en": "The transaction is not a sale",
            "fr": "La transaction n'est pas une vente",
        }
    )

    TRANSACTION_NOT_COMMERCE: TranslatedString = TranslatedString(
        {
            "en": "The transaction is not a commerce",
            "fr": "La transaction n'est pas un commerce",
        }
    )

    def __getattribute__(self, __name: str) -> str:
        """Get the translated string."""
        attr = super().__getattribute__(__name)
        if isinstance(attr, Translator.TranslatedString):
            attr._element = self._element
            return str(attr)
        return attr
