from typing import TypedDict
from datetime import datetime as dt, date
from apiflask import Schema
from apiflask.fields import Float, Integer, Nested, DateTime, Date, String
from apiflask.validators import OneOf
from marshmallow import validates, ValidationError

from app.schemas.person import PersonOut


class TransactionQuery(Schema):
    pageSize: int = Integer(default=10)
    pageIndex: int = Integer(default=1)
    dateTime: date = Date()
    transactionType: int = Integer(
        validate=[
            OneOf([1, 2, None], error="Tipo de transação inválida, deve ser 1 ou 2.")
        ],
    )


class TransactionFilter(TypedDict):
    pageSize: int
    pageIndex: int
    dateTime: date
    transactionType: int


class TransactionIn(Schema):
    money: float = Float(required=True)

    @validates("money")
    def validate_money(self, money: float, **kwargs):
        if money <= 0:
            raise ValidationError("O valor da transação deve ser maior que zero.")


class TransactionTransfer(TransactionIn):
    accountId: int = Integer(required=True)


class TransactionOut(Schema):
    id: int = Integer()
    money: float = Float()
    dateTime: dt = DateTime()
    transactionType: int = Integer()
    account: dict = Nested(PersonOut)
    originAccount: dict = Nested(PersonOut)


class TransactionMonthResume(Schema):
    month: str = String()
    label: str = String()
    amount: float = Float()


class TransactionMonthResumeDict(TypedDict):
    month: int
    label: str
    amount: float
