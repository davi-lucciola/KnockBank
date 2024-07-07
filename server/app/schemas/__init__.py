from apiflask import Schema
from apiflask.fields import String, Dict, Integer


class Response(Schema):
    message: str = String()
    detail: dict = Dict(default={})


class PaginationQuery(Schema):
    limit: int = Integer(default=10)
    offset: int = Integer(default=0)


from .person import *
from .account import *
from .user import *
from .transaction import *
