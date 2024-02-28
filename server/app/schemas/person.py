from apiflask import Schema
from apiflask.fields import Integer, String


class PersonOut(Schema):
    id: int = Integer()
    nome: int = String()
