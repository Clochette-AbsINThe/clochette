from enum import Enum


class IconName(str, Enum):
    GLASS = "Glass"
    BEER = "Beer"
    FOOD = "Food"
    SOFT = "Soft"
    BARREL = "Barrel"
    MISC = "Misc"


class PaymentMethod(str, Enum):
    CARD = "CB"
    CASH = "Espèces"
    LYDIA = "Lydia"
    TRANSFER = "Virement"


class SecurityScopesHierarchy(Enum):
    staff = 1
    treasurer = 2
    president = 3


class SecurityScopes(str, Enum):
    STAFF = "staff"
    TREASURER = "treasurer"
    PRESIDENT = "president"


class TransactionTypeV1(str, Enum):
    TRANSACTION = "transaction"
    TRESORERY = "tresorery"


class TradeType(str, Enum):
    PURCHASE = "purchase"
    SALE = "sale"


class TransactionType(str, Enum):
    COMMERCE = "commerce"
    TRESORERY = "tresorery"


class Status(str, Enum):
    PENDING = "pending"
    VALIDATED = "validated"
