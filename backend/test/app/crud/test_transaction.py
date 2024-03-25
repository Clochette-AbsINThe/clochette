import datetime
from test.base_test import BaseTest

import pytest
from fastapi import HTTPException

from app.core.types import IconName, PaymentMethod, TradeType
from app.crud.crud_barrel import barrel as crud_barrel
from app.crud.crud_consumable import consumable as crud_consumable
from app.crud.crud_consumable_item import consumable_item as crud_consumable_item
from app.crud.crud_drink_item import drink_item as crud_drink_item
from app.crud.crud_glass import glass as crud_glass
from app.crud.crud_transaction import transaction as crud_transaction
from app.crud.crud_treasury import treasury as crud_treasury
from app.dependencies import get_db
from app.schemas.consumable_item import ConsumableItemCreate
from app.schemas.drink_item import DrinkItemCreate
from app.schemas.treasury import TreasuryCreate
from app.schemas.v2.barrel import BarrelCreate, BarrelUpdateSale
from app.schemas.v2.consumable import ConsumableCreate, ConsumableUpdateSale
from app.schemas.v2.glass import GlassCreate
from app.schemas.v2.transaction import (
    TransactionCommerceCreate,
    TransactionCommerceUpdate,
    TransactionTreasuryCreate,
)


class TestCRUDTransaction(BaseTest):
    async def asyncSetUp(self) -> None:
        await super().asyncSetUp()

        async with get_db.get_session() as session:
            self.consumable_item_in_db = await crud_consumable_item.create(
                session,
                obj_in=ConsumableItemCreate(
                    name="test_name",
                    icon=IconName.MISC,
                ),
            )
            self.drink_item_in_db = await crud_drink_item.create(
                session,
                obj_in=DrinkItemCreate(
                    name="test_name",
                ),
            )
            await crud_treasury.create(
                db=session,
                obj_in=TreasuryCreate(
                    total_amount=0,
                    cash_amount=0,
                    lydia_rate=0.015,
                ),
            )

    async def test_delete_consumable(self):
        async with get_db.get_session() as session:
            # Purchase transaction
            transaction_purchase = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.PURCHASE,
                ),
            )
            await crud_consumable.create_v2(
                session,
                obj_in=ConsumableCreate(
                    consumable_item_id=self.consumable_item_in_db.id,
                    buy_price=1,
                    sell_price=1,
                    transactionId=transaction_purchase.id,
                ),
            )
            await session.refresh(transaction_purchase)

            await crud_transaction.validate(
                session,
                db_obj=transaction_purchase,
                obj_in=TransactionCommerceUpdate(),
            )

            await session.refresh(transaction_purchase)
            assert transaction_purchase.consumables_purchase is not None

            treasury = await crud_treasury.get_last_treasury(session)
            self.assertEqual(treasury.total_amount, -1)
            self.assertEqual(len(transaction_purchase.consumables_purchase), 1)
            self.assertEqual(transaction_purchase.amount, -1)

            consumables = await crud_consumable.query(session)
            self.assertEqual(len(consumables), 1)

            # Sale transaction
            transaction_sale = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.SALE,
                ),
            )

            await crud_consumable.update_v2(
                session,
                db_obj=consumables[0],
                obj_in=ConsumableUpdateSale(
                    transactionId=transaction_sale.id,
                ),
            )
            await session.refresh(transaction_sale)

            await crud_transaction.validate(
                session,
                db_obj=transaction_sale,
                obj_in=TransactionCommerceUpdate(),
            )
            await session.refresh(transaction_sale)

            treasury = await crud_treasury.get_last_treasury(session)
            self.assertEqual(treasury.total_amount, 0)

            consumables = await crud_consumable.query(session)

            self.assertEqual(len(consumables), 1)
            self.assertEqual(consumables[0].transaction_id_sale, transaction_sale.id)
            self.assertEqual(consumables[0].transaction_id_purchase, transaction_purchase.id)
            treasury = await crud_treasury.get_last_treasury(session)
            self.assertEqual(treasury.total_amount, 0)

        async with get_db.get_session() as session:
            # Delete the purchase transaction
            with pytest.raises(HTTPException):
                await crud_transaction.delete(session, id=transaction_purchase.id)

        async with get_db.get_session() as session:
            # Delete the sale transaction
            await crud_transaction.delete(session, id=transaction_sale.id)

            consumables = await crud_consumable.query(session)
            self.assertEqual(len(consumables), 1)
            self.assertEqual(consumables[0].transaction_id_sale, None)
            self.assertEqual(consumables[0].transaction_id_purchase, transaction_purchase.id)
            transaction_purchase = await crud_transaction.read(session, id=transaction_purchase.id)
            assert transaction_purchase is not None
            self.assertEqual(len(transaction_purchase.consumables_purchase), 1)
            self.assertEqual(consumables[0].solded, False)

            treasury = await crud_treasury.get_last_treasury(session)
            self.assertEqual(treasury.total_amount, -1)

    async def test_delete_barrel_glass(self):
        async with get_db.get_session() as session:
            # Purchase transaction
            transaction_purchase = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.PURCHASE,
                ),
            )
            await crud_barrel.create_v2(
                session,
                obj_in=BarrelCreate(
                    drink_item_id=self.drink_item_in_db.id,
                    buy_price=1,
                    sell_price=1,
                    transactionId=transaction_purchase.id,
                ),
            )
            await session.refresh(transaction_purchase)

            await crud_transaction.validate(
                session,
                db_obj=transaction_purchase,
                obj_in=TransactionCommerceUpdate(),
            )

            await session.refresh(transaction_purchase)
            assert transaction_purchase.barrels_purchase is not None

            self.assertEqual(len(transaction_purchase.barrels_purchase), 1)
            self.assertEqual(transaction_purchase.amount, -1)

            barrels = await crud_barrel.query(session)
            self.assertEqual(len(barrels), 1)

            # Sale transaction
            transaction_sale = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.SALE,
                ),
            )

            await crud_glass.create_v2(
                session,
                obj_in=GlassCreate(
                    barrel_id=barrels[0].id,
                    transaction_id=transaction_sale.id,
                ),
            )
            await session.refresh(transaction_sale)

            await crud_transaction.validate(
                session,
                db_obj=transaction_sale,
                obj_in=TransactionCommerceUpdate(),
            )
            await session.refresh(transaction_sale)

            barrels = await crud_barrel.query(session)
            glasses = await crud_glass.query(session)

            self.assertEqual(len(barrels), 1)
            self.assertEqual(glasses[0].transaction_id, transaction_sale.id)
            self.assertEqual(barrels[0].transaction_id_purchase, transaction_purchase.id)

        async with get_db.get_session() as session:
            # Delete the purchase transaction
            with pytest.raises(HTTPException):
                await crud_transaction.delete(session, id=transaction_purchase.id)

        async with get_db.get_session() as session:
            # Delete the sale transaction
            await crud_transaction.delete(session, id=transaction_sale.id)

            barrels = await crud_barrel.query(session)
            glasses = await crud_glass.query(session)
            self.assertEqual(len(barrels), 1)
            self.assertEqual(len(glasses), 0)
            self.assertEqual(barrels[0].transaction_id_purchase, transaction_purchase.id)
            transaction_purchase = await crud_transaction.read(session, id=transaction_purchase.id)
            assert transaction_purchase is not None
            self.assertEqual(len(transaction_purchase.barrels_purchase), 1)

    async def test_delete_barrel(self):
        async with get_db.get_session() as session:
            # Purchase transaction
            transaction_purchase = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.PURCHASE,
                ),
            )
            await crud_barrel.create_v2(
                session,
                obj_in=BarrelCreate(
                    drink_item_id=self.drink_item_in_db.id,
                    buy_price=1,
                    sell_price=1,
                    transactionId=transaction_purchase.id,
                ),
            )
            await session.refresh(transaction_purchase)

            await crud_transaction.validate(
                session,
                db_obj=transaction_purchase,
                obj_in=TransactionCommerceUpdate(),
            )

            await session.refresh(transaction_purchase)
            assert transaction_purchase.barrels_purchase is not None

            self.assertEqual(len(transaction_purchase.barrels_purchase), 1)
            self.assertEqual(transaction_purchase.amount, -1)

            barrels = await crud_barrel.query(session)
            self.assertEqual(len(barrels), 1)

            # Sale transaction
            transaction_sale = await crud_transaction.create_v2(
                session,
                obj_in=TransactionCommerceCreate(
                    datetime=datetime.datetime.now(),
                    payment_method=PaymentMethod.CARD,
                    trade=TradeType.SALE,
                ),
            )

            await crud_barrel.update_v2(
                session,
                db_obj=barrels[0],
                obj_in=BarrelUpdateSale(
                    barrel_sell_price=1,
                    transactionId=transaction_sale.id,
                ),
            )
            await session.refresh(transaction_sale)

            await crud_transaction.validate(
                session,
                db_obj=transaction_sale,
                obj_in=TransactionCommerceUpdate(),
            )
            await session.refresh(transaction_sale)

            barrels = await crud_barrel.query(session)

            self.assertEqual(len(barrels), 1)
            self.assertEqual(barrels[0].transaction_id_sale, transaction_sale.id)
            self.assertEqual(barrels[0].transaction_id_purchase, transaction_purchase.id)

        async with get_db.get_session() as session:
            # Delete the purchase transaction
            with pytest.raises(HTTPException):
                await crud_transaction.delete(session, id=transaction_purchase.id)

        async with get_db.get_session() as session:
            # Delete the sale transaction
            await crud_transaction.delete(session, id=transaction_sale.id)

            barrels = await crud_barrel.query(session)
            self.assertEqual(len(barrels), 1)
            self.assertEqual(barrels[0].transaction_id_sale, None)
            self.assertEqual(barrels[0].transaction_id_purchase, transaction_purchase.id)
            transaction_purchase = await crud_transaction.read(session, id=transaction_purchase.id)
            assert transaction_purchase is not None
            self.assertEqual(len(transaction_purchase.barrels_purchase), 1)
            self.assertEqual(barrels[0].empty_or_solded, False)

    async def test_create_treasury(self):
        async with get_db.get_session() as session:
            # Purchase transaction
            transaction_treasury = await crud_transaction.create_treasury(
                session,
                obj_in=TransactionTreasuryCreate(
                    datetime=datetime.datetime.now(),
                    description="test",
                    amount=10,
                    trade=TradeType.SALE,
                    payment_method=PaymentMethod.CARD,
                ),
            )

            await session.refresh(transaction_treasury)
            assert transaction_treasury.amount == 10

            treasury = await crud_treasury.get_last_treasury(session)
            assert treasury.total_amount == 10
