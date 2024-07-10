from typing import TypedDict
from apiflask import Schema
from apiflask.fields import Integer, List, Dict


class PaginationQuery(Schema):
    pageIndex: int = Integer(required=False, load_default=1)
    pageSize: int = Integer(required=False, load_default=10)


class TPaginationQuery(TypedDict):
    pageSize: int
    pageIndex: int


class PaginationResponse(Schema):
    data: list = List(Dict)
    total: int = Integer()
    totalPages: int = Integer()
    pageIndex: int = Integer()
    pageSize: int = Integer()


class PaginationBuilder:
    @staticmethod
    def build(
        data: list, total: int, total_pages: int, page_index: int, page_size: int
    ):
        return {
            "data": data,
            "total": total,
            "totalPages": total_pages,
            "pageIndex": page_index,
            "pageSize": page_size,
        }
