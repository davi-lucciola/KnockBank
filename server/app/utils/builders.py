from app.utils.types import TPaginationResponse, TData


class PaginationBuilder:
    @staticmethod
    def build(
        data: list[TData],
        total: int,
        total_pages: int,
        page_index: int,
        page_size: int,
    ) -> TPaginationResponse[TData]:
        return {
            "data": data,
            "total": total,
            "totalPages": total_pages,
            "pageIndex": page_index,
            "pageSize": page_size,
        }
