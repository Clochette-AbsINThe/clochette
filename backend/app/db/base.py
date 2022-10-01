# Import all the models so that Alembic can see the models and generate the migration scripts accordingly.
from app.db.base_class import Base
from app.models.account import Account
from app.models.barrel import Barrel
from app.models.consumable_item import ConsumableItem
from app.models.consumable import Consumable
from app.models.drink import Drink
from app.models.glass import Glass
from app.models.out_of_stock_item import OutOfStockItem
from app.models.out_of_stock import OutOfStock
from app.models.stock import Stock
from app.models.transaction import Transaction
from app.models.treasury import Treasury
