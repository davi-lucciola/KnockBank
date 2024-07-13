from apiflask import Schema
from apiflask.fields import String
from apiflask.validators import Length


class UserLogin(Schema):
    cpf: str = String(required=True, validate=[Length(equal=11)])
    password: str = String(required=True)
