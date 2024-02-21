from apiflask import Schema
from apiflask.fields import String, Dict


class Response(Schema):
    message: str = String()
    detail: dict = Dict(default={})


from .account import *
from .user import *
from .transaction import *
