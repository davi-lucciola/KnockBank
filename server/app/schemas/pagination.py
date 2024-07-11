from apiflask import Schema
from apiflask.fields import Integer, List, Dict


class PaginationQuery(Schema):
    pageIndex: int = Integer(required=False, load_default=1)
    pageSize: int = Integer(required=False, load_default=10)


class PaginationResponse(Schema):
    data: list = List(Dict)
    total: int = Integer()
    totalPages: int = Integer()
    pageIndex: int = Integer()
    pageSize: int = Integer()
