from typing import Generic, TypedDict, TypeVar

TData = TypeVar("TData")


class TPaginationResponse(Generic[TData], TypedDict):
    data: list[TData]
    total: int
    totalPages: int
    pageIndex: int
    pageSize: int


class TPaginationQuery(TypedDict):
    pageSize: int
    pageIndex: int
