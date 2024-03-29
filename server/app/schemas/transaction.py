from apiflask import Schema
from apiflask.fields import Float, Integer, Dict
from marshmallow import validates, ValidationError


class TransactionIn(Schema):
    money: float = Float(required=True)

    @validates("money")
    def validate_money(self, money: float, **kwargs):
        if money <= 0:
            raise ValidationError("O valor da transação deve ser maior que zero.")


class TransactionTransfer(TransactionIn):
    account_id: int = Integer(required=True)


class TransactionOut(Schema):
    id: int = Integer()
    money: float = Float()
    transaction_type: dict = Dict()
