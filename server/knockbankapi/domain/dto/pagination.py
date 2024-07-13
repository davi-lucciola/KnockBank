from typing import Generic, TypedDict, TypeVar

TData = TypeVar("TData")


class PaginationResponseDTO(Generic[TData], TypedDict):
    data: list[TData]
    total: int
    totalPages: int
    pageIndex: int
    pageSize: int


class PaginationQueryDTO(TypedDict):
    pageSize: int
    pageIndex: int


class PaginationBuilder:
    @staticmethod
    def build(
        data: list[TData],
        total: int,
        total_pages: int,
        page_index: int,
        page_size: int,
    ) -> PaginationResponseDTO[TData]:
        return {
            "data": data,
            "total": total,
            "totalPages": total_pages,
            "pageIndex": page_index,
            "pageSize": page_size,
        }
