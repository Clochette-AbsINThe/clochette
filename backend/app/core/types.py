from enum import Enum

from threading import Lock

from app.core.utils.misc import convert_enum_to_str

class IconName(str, Enum):
    glass = 'Glass'
    beer = 'Beer'
    food = 'Food'
    soft = 'Soft'
    barrel = 'Barrel'
    misc = 'Misc'


class PaymentMethod(str, Enum):
    card = 'CB'
    cash = 'Espèces'
    lydia = 'Lydia'
    transfer = 'Virement'


class SecurityScopesHierarchy(Enum):
    staff = 1
    treasurer = 2
    president = 3


SecurityScopes = convert_enum_to_str(SecurityScopesHierarchy, name='SecurityScopes')


class TransactionType(str, Enum):
    transaction = 'transaction'
    tresorery = 'tresorery'


class SynchronizedClass:
    """
    Class to synchronize methods.
    """
    def __init__(self):
        self.lock = Lock()