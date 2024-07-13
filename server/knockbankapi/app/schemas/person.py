from datetime import date
from apiflask import Schema
from apiflask.fields import Integer, String, Date


class PersonBasic(Schema):
    id: int = Integer()
    name: int = String()
    cpf: str = String()


class PersonOut(PersonBasic):
    birthDate: date = Date()
