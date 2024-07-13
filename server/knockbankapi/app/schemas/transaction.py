from datetime import datetime as dt, date
from apiflask import Schema
from apiflask.validators import OneOf
from apiflask.fields import Float, Integer, Nested, DateTime, Date, String, List
from marshmallow import validates, ValidationError
from knockbankapi.app.schemas import PaginationQuery, PaginationResponse, PersonBasic


class TransactionQuery(PaginationQuery):
    transactionDate: date = Date()
    transactionType: int = Integer(
        validate=[
            OneOf([1, 2, None], error="Tipo de transação inválida, deve ser 1 ou 2.")
        ],
    )


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
    account: dict = Nested(PersonBasic)
    originAccount: dict = Nested(PersonBasic)


class PaginationTransactionOut(PaginationResponse):
    data = List(Nested(TransactionOut))

class TransactionMonthResume(Schema):
    month: str = String()
    label: str = String()
    amount: float = Float()
