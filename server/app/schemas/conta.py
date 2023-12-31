from datetime import date
from apiflask import Schema
from apiflask.fields import Integer, String, Date, Float, Boolean, Dict
from apiflask.validators import OneOf, Length, Range


class ContaIn(Schema):
    nome: str = String(required=True)
    cpf: str = String(required=True, validate=[Length(equal=11)])
    data_nascimento: date = Date(required=True)
    senha: str = String(required=True, validate=[Length(min=8)])
    tipo_conta: int = Integer(required=True, validate=[OneOf([1, 2, 3, 4], error='Tipo de conta Inválido. Deve ser 1, 2, 3 ou 4.')])
    limite_saque_diario: float = Float(required=False, validate=[Range(min=0)], default=999)

class ContaOut(Schema):
    id: int = Integer()
    saldo: float = Float()
    fl_ativo: bool = Boolean()
    pessoa: dict = Dict()
    tipo_conta: dict = Dict()
    limite_saque_diario: float = Float()