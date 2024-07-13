from apiflask import Schema
from apiflask.fields import String, Dict


class Response(Schema):
    message: str = String()
    detail: dict = Dict(load_default={})


from .pagination import *
from .person import *
from .account import *
from .user import *
from .transaction import *
