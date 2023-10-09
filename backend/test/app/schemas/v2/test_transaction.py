import datetime

from app.core.types import PaymentMethod, TradeType
from app.schemas.v2.transaction import TransactionTreasuryCreate


def test_amount_must_match_trade_purchase_0():
    transaction = TransactionTreasuryCreate(
        datetime=datetime.datetime.now(),
        description="test",
        amount=10,
        trade=TradeType.PURCHASE,
        payment_method=PaymentMethod.CARD,
    )

    assert transaction.amount == -10


def test_amount_must_match_trade_purchase_1():
    transaction = TransactionTreasuryCreate(
        datetime=datetime.datetime.now(),
        description="test",
        amount=-10,
        trade=TradeType.PURCHASE,
        payment_method=PaymentMethod.CARD,
    )

    assert transaction.amount == -10


def test_amount_must_match_trade_sale_0():
    transaction = TransactionTreasuryCreate(
        datetime=datetime.datetime.now(),
        description="test",
        amount=10,
        trade=TradeType.SALE,
        payment_method=PaymentMethod.CARD,
    )

    assert transaction.amount == 10


def test_amount_must_match_trade_sale_1():
    transaction = TransactionTreasuryCreate(
        datetime=datetime.datetime.now(),
        description="test",
        amount=-10,
        trade=TradeType.SALE,
        payment_method=PaymentMethod.CARD,
    )

    assert transaction.amount == 10
