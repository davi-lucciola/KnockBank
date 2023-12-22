from http import HTTPStatus
from dataclasses import dataclass
from apiflask import HTTPError


@dataclass
class DomainError(HTTPError):
    message: str
    status_code: int = HTTPStatus.BAD_REQUEST