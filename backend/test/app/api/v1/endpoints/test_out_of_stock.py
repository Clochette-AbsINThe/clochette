from test.base_test import BaseTest

from app.core.types import IconName
from app.crud.crud_out_of_stock import out_of_stock as crud_out_of_stock
from app.crud.crud_out_of_stock_item import out_of_stock_item as crud_out_of_stock_item
from app.dependencies import get_db
from app.schemas.out_of_stock import OutOfStock, OutOfStockCreate
from app.schemas.out_of_stock_item import OutOfStockItem, OutOfStockItemCreate


class TestOutOfStock(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        self.out_of_stock_item_create = OutOfStockItemCreate(name="test_name", icon=IconName.MISC)

        async with get_db.get_session() as session:
            self.out_of_stock_item_db = OutOfStockItem.model_validate(
                await crud_out_of_stock_item.create(session, obj_in=self.out_of_stock_item_create)
            )
            self.out_of_stock_create = OutOfStockCreate(
                fkId=self.out_of_stock_item_db.id,
                unit_price=1,
            )
            self.out_of_stock_db = OutOfStock.model_validate(
                await crud_out_of_stock.create(session, obj_in=self.out_of_stock_create)
            )

        assert self.out_of_stock_db.name == self.out_of_stock_item_create.name

    def test_read_out_of_stocks(self):
        # Arrange
        # Act
        response = self._client.get("/api/v1/out_of_stock/")

        # Assert
        assert response.status_code == 200
        assert response.json() == [self.out_of_stock_db.model_dump(by_alias=True)]
