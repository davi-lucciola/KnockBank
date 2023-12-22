from typing import Any
from http import HTTPStatus
from dataclasses import dataclass
from apiflask import HTTPError


@dataclass
class InfraError(HTTPError):
    message: str
    status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR