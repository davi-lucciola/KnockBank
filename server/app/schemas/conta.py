from datetime import date
from apiflask import Schema
from apiflask.fields import Integer, String, Date, Float
from apiflask.validators import OneOf, Length, Range


class ContaIn(Schema):
    nome: str = String(required=True)
    cpf: str = String(required=True, validate=[Length(equal=11)])
    data_nascimento: date = Date(required=True)
    tipo_conta: int = Integer(required=True, validate=[OneOf([1, 2, 3, 4], error='Tipo de conta Inválido. Deve ser 1, 2, 3 ou 4.')])
    limite_saque_diario: float = Float(required=False, validate=[Range(min=0)], default=999)
