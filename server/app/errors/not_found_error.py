from http import HTTPStatus
from dataclasses import dataclass
from apiflask import HTTPError


@dataclass
class NotFoundError(HTTPError):
    message: str
    status_code: int = HTTPStatus.NOT_FOUND