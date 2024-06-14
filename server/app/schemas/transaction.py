from apiflask import Schema
from apiflask.fields import Float, Integer, Dict, Nested
from marshmallow import validates, ValidationError

from app.schemas.person import PersonOut


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
    transactionType: dict = Dict()
    account: dict = Nested(PersonOut)
    originAccount: dict = Nested(PersonOut)
