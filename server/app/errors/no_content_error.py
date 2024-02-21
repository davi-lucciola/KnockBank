from http import HTTPStatus
from dataclasses import dataclass
from apiflask import HTTPError


@dataclass
class NoContentError(HTTPError):
    status_code: int = HTTPStatus.NO_CONTENT
