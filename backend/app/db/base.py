# Import all the models so that Alembic can see the models and generate the migration scripts accordingly.
from app.db.base_class import Base  # noqa
from app.models.account import Account  # noqa
from app.models.barrel import Barrel  # noqa
from app.models.consumable import Consumable  # noqa
from app.models.consumable_item import ConsumableItem  # noqa
from app.models.drink_item import DrinkItem  # noqa
from app.models.glass import Glass  # noqa
from app.models.non_inventoried import NonInventoried  # noqa
from app.models.non_inventoried_item import NonInventoriedItem  # noqa
from app.models.out_of_stock import OutOfStock  # noqa
from app.models.out_of_stock_item import OutOfStockItem  # noqa
from app.models.transaction import Transaction  # noqa
from app.models.transaction_v1 import TransactionV1  # noqa
from app.models.treasury import Treasury  # noqa
