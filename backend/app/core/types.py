from enum import Enum


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